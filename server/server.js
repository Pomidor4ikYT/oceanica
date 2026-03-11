// server/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Безпечний парсинг JSON
function safeJsonParse(value, defaultValue = []) {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

// Підключення до PostgreSQL з перевіркою
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/oceanica';
console.log(`Спроба підключення до БД: ${databaseUrl.replace(/:[^:]*@/, ':***@')}`);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Перевірка з'єднання
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Помилка підключення до БД:', err.message);
  } else {
    console.log('✅ Підключено до PostgreSQL');
    release();
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ========== Ініціалізація таблиць ==========
async function initDb() {
  try {
    // Перевіряємо, чи існує таблиця users
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      // Створюємо таблицю з колонкою role
      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          registered TEXT NOT NULL,
          bio TEXT,
          role TEXT DEFAULT 'user'
        )
      `);
      console.log('✅ Таблицю users створено');
    } else {
      // Перевіряємо, чи існує колонка role
      const columnExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'role'
        );
      `);

      if (!columnExists.rows[0].exists) {
        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN role TEXT DEFAULT 'user'
        `);
        console.log('✅ Колонку role додано до таблиці users');
      }
    }

    // Таблиця обраного
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        title TEXT NOT NULL,
        image TEXT,
        price TEXT,
        meta TEXT,
        badge TEXT,
        chips TEXT,
        category TEXT
      )
    `);

    // Таблиця бронювань
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        title TEXT NOT NULL,
        image TEXT,
        price TEXT,
        meta TEXT,
        badge TEXT,
        chips TEXT,
        category TEXT,
        bookingDate TEXT
      )
    `);

    // Таблиця турів
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        duration TEXT,
        groupSize TEXT,
        accommodation TEXT,
        badge TEXT,
        category TEXT,
        image TEXT,
        departureDates TEXT,
        chips TEXT,
        meta TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Таблиці створено або вже існують');
    
    // Створюємо тестового адміністратора
    await createAdminUser();
    
    // Додаємо початкові дані
    await seedInitialData();
  } catch (err) {
    console.error('❌ Помилка створення таблиць:', err);
  }
}

// Створення тестового адміністратора
async function createAdminUser() {
  try {
    const result = await pool.query("SELECT email FROM users WHERE email = 'admintest1@gmail.com'");
    
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admintest1', 10);
      const registered = new Date().toLocaleDateString('uk-UA');
      
      await pool.query(
        'INSERT INTO users (name, email, password, registered, role) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', 'admintest1@gmail.com', hashedPassword, registered, 'admin']
      );
      console.log('✅ Адміністратора створено');
    } else {
      await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admintest1@gmail.com'");
      console.log('✅ Роль оновлено до адміністратора');
    }
  } catch (error) {
    console.error('Помилка створення адміністратора:', error);
  }
}

// Початкові дані - ВИПРАВЛЕНО екранування лапок
async function seedInitialData() {
  try {
    // Перевіряємо чи є вже тури
    const toursCount = await pool.query("SELECT COUNT(*) FROM tours WHERE type = 'tour'");
    if (parseInt(toursCount.rows[0].count) === 0) {
      // Тури - ВИПРАВЛЕНО екранування лапок
      await pool.query(`
        INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) VALUES
        ('tour', 'Таїланд: Пхукет & Пхі-Пхі', 'Райські пляжі Таїланду', '39900 грн', '10 ночей', '25 осіб', 'Готель 4*', '🏖️Пляжний', 'beach', 'toursimg/tour1.jpg', '[\"15.03.2026\",\"22.03.2026\",\"05.04.2026\"]', '[\"Пальми\",\"Вапнякові скелі\",\"Дайвінг\"]', '10 днів • All Inclusive'),
        ('tour', 'Італія: Рим, Флоренція, Венеція', 'Класичний тур по Італії', '31200 грн', '8 днів', '30 осіб', 'Готель 3-4*', '🏛️Екскурсійний', 'excursion', 'toursimg/tour2.jpg', '[\"10.04.2026\",\"24.04.2026\",\"08.05.2026\"]', '[\"Колізей\",\"Да Вінчі\",\"Гондоли\"]', '8 днів • сніданки'),
        ('tour', 'Непал: Еверест та храми', 'Треккінг до Евересту', '47500 грн', '12 днів', '15 осіб', 'Кемп', '⛰️Гірський', 'mountain', 'toursimg/tour3.jpg', '[\"20.03.2026\",\"03.04.2026\",\"17.04.2026\"]', '[\"Гімалаї\",\"Буддизм\",\"Базовий табір\"]', '12 днів • Trekking'),
        ('tour', 'Мальдіви: райські атоли', 'Екзотичні Мальдіви', '67800 грн', '7 ночей', '20 осіб', 'Готель 5*', '🏖️Пляжний', 'beach', 'toursimg/tour4.jpg', '[\"05.05.2026\",\"19.05.2026\",\"02.06.2026\"]', '[\"Лагуна\",\"Снорклінг\",\"SPA\"]', '7 днів • вілли над водою')
      `);
      console.log('✅ Початкові тури додано');
    }

    // Круїзи - ВИПРАВЛЕНО екранування лапок
    const cruisesCount = await pool.query("SELECT COUNT(*) FROM tours WHERE type = 'cruise'");
    if (parseInt(cruisesCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) VALUES
        ('cruise', 'Середземне море', 'Круїз Середземним морем', '42500 грн', '7 ночей', '200 осіб', 'Лайнер', '☀️ Теплі води', 'warm', 'cruiseimg/cruise1.jpg', '[\"15.03.2026\",\"22.03.2026\",\"05.04.2026\"]', '[\"Італія\",\"Греція\",\"Іспанія\"]', '7 ночей'),
        ('cruise', 'Карибські острови', 'Круїз Карибами', '67800 грн', '10 ночей', '250 осіб', 'Лайнер', '☀️ Теплі води', 'warm', 'cruiseimg/cruise2.jpg', '[\"10.04.2026\",\"24.04.2026\",\"08.05.2026\"]', '[\"Багами\",\"Ямайка\",\"Каймани\"]', '10 ночей'),
        ('cruise', 'Норвезькі фіорди', 'Круїз фіордами', '53200 грн', '8 ночей', '180 осіб', 'Експедиційний', '❄️ Холодні води', 'cold', 'cruiseimg/cruise3.jpg', '[\"20.03.2026\",\"03.04.2026\",\"17.04.2026\"]', '[\"Берген\",\"Гейрангер\",\"Льодовики\"]', '8 ночей'),
        ('cruise', 'Аляска', 'Круїз до Аляски', '61500 грн', '9 ночей', '220 осіб', 'Преміум', '❄️ Холодні води', 'cold', 'cruiseimg/cruise4.jpg', '[\"05.05.2026\",\"19.05.2026\",\"02.06.2026\"]', '[\"Джуно\",\"Сьюард\",\"Кити\"]', '9 ночей')
      `;
      console.log('✅ Початкові круїзи додано');
    }

    // Острови - ВИПРАВЛЕНО екранування лапок
    const islandsCount = await pool.query("SELECT COUNT(*) FROM tours WHERE type = 'island'");
    if (parseInt(islandsCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) VALUES
        ('island', 'Мальдіви', 'Райські острови', '67800 грн', '7 ночей', '10 осіб', 'Готель 5*', '🏝️ Тропічний', 'tropical', 'islandimg/island1.jpg', '[\"05.03.2026\",\"12.03.2026\",\"19.03.2026\"]', '[\"Вілли\",\"Дайвінг\",\"SPA\"]', '7 ночей'),
        ('island', 'Ісландія', 'Країна льодовиків', '62300 грн', '8 днів', '15 осіб', 'Готель', '🌋 Вулканічний', 'volcanic', 'islandimg/island2.jpg', '[\"10.03.2026\",\"17.03.2026\",\"24.03.2026\"]', '[\"Гейзери\",\"Водоспади\",\"Північне сяйво\"]', '8 днів'),
        ('island', 'Бора-Бора', 'Найкрасивіша лагуна', '59960 грн', '7 ночей', '8 осіб', 'Готель 5*', '✨ Екзотичний', 'exotic', 'islandimg/island3.jpg', '[\"15.03.2026\",\"22.03.2026\",\"29.03.2026\"]', '[\"Бунгало\",\"Рифи\",\"Акули\"]', '7 ночей'),
        ('island', 'Сейшели', 'Гранітні острови', '43960 грн', '7 ночей', '12 осіб', 'Готель 4*', '🏝️ Тропічний', 'tropical', 'islandimg/island4.jpg', '[\"20.03.2026\",\"27.03.2026\",\"03.04.2026\"]', '[\"Черепахи\",\"Пляжі\",\"Снорклінг\"]', '7 ночей')
      `;
      console.log('✅ Початкові острови додано');
    }

    // Гарячі путівки - ВИПРАВЛЕНО екранування лапок
    const hotCount = await pool.query("SELECT COUNT(*) FROM tours WHERE type = 'hot'");
    if (parseInt(hotCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) VALUES
        ('hot', 'Єгипет All Inclusive', 'Гаряча пропозиція', '23960 грн', '7 ночей', '40 осіб', 'Готель 5*', '-20%', 'beach', 'indeximg/bar1.jpg', '[\"01.11.2026\",\"08.11.2026\",\"15.11.2026\"]', '[\"Піраміди\",\"Червоне море\",\"All Inclusive\"]', '7 ночей'),
        ('hot', 'Санторіні', 'Романтичний відпочинок', '19160 грн', '5 ночей', '25 осіб', 'Готель 4*', '-15%', 'excursion', 'indeximg/bar2.jpg', '[\"15.05.2026\",\"22.05.2026\",\"29.05.2026\"]', '[\"Закати\",\"Білі будинки\",\"Романтика\"]', '5 ночей'),
        ('hot', 'Марокко', 'Подорож до Сахари', '15960 грн', '6 ночей', '20 осіб', 'Готель 3-4*', '-18%', 'excursion', 'indeximg/bar3.jpg', '[\"10.09.2026\",\"17.09.2026\",\"24.09.2026\"]', '[\"Сахара\",\"Марракеш\",\"Базари\"]', '6 ночей'),
        ('hot', 'Мальдіви', 'Рай на землі', '51960 грн', '7 ночей', '15 осіб', 'Готель 5*', '-12%', 'beach', 'indeximg/bar4.jpg', '[\"05.12.2026\",\"12.12.2026\",\"19.12.2026\"]', '[\"Вілли\",\"Дайвінг\",\"SPA\"]', '7 ночей')
      `;
      console.log('✅ Початкові гарячі путівки додано');
    }
  } catch (error) {
    console.error('Помилка додавання початкових даних:', error);
  }
}

// Запускаємо ініціалізацію
initDb();

// ========== Допоміжна функція для перевірки токена ==========
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Токен відсутній' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Недійсний токен' });
    req.user = user;
    next();
  });
}

// Middleware для перевірки адміністратора
async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Токен відсутній' });

  try {
    const user = jwt.verify(token, SECRET_KEY);
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [user.email]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Доступ заборонено' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Недійсний токен' });
  }
}

// ========== РЕЄСТРАЦІЯ ==========
app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Заповніть всі обов\'язкові поля' });
  }

  try {
    const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const registered = new Date().toLocaleDateString('uk-UA');

    await pool.query(
      'INSERT INTO users (name, email, phone, password, registered, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, phone || '', hashedPassword, registered, 'user']
    );

    const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { name, email, phone: phone || '', registered, role: 'user' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// ========== ВХІД ==========
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Введіть email та пароль' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ success: false, message: 'Невірний email або пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Невірний email або пароль' });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        registered: user.registered,
        bio: user.bio || '',
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// ========== ОТРИМАННЯ ДАНИХ КОРИСТУВАЧА ==========
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT name, email, phone, registered, bio, role FROM users WHERE email = $1', [req.user.email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
});

// ========== ОНОВЛЕННЯ ДАНИХ КОРИСТУВАЧА ==========
app.put('/user', authenticateToken, async (req, res) => {
  const { name, email, phone, bio, password } = req.body;
  const userEmail = req.user.email;

  try {
    if (email && email !== userEmail) {
      const existing = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Цей email вже використовується' });
      }
    }

    let query = 'UPDATE users SET ';
    const values = [];
    const updates = [];

    if (name) { updates.push(`name = $${values.length+1}`); values.push(name); }
    if (email) { updates.push(`email = $${values.length+1}`); values.push(email); }
    if (phone !== undefined) { updates.push(`phone = $${values.length+1}`); values.push(phone); }
    if (bio !== undefined) { updates.push(`bio = $${values.length+1}`); values.push(bio); }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${values.length+1}`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    query += updates.join(', ') + ` WHERE email = $${values.length+1} RETURNING name, email, phone, bio`;
    values.push(userEmail);

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0];

    let token = null;
    if (email && email !== userEmail) {
      token = jwt.sign({ email: updatedUser.email, name: updatedUser.name }, SECRET_KEY, { expiresIn: '7d' });
    }

    res.json({
      success: true,
      user: updatedUser,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// ========== ОТРИМАННЯ ОБРАНОГО ==========
app.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT title, image, price, meta, badge, chips, category FROM favorites WHERE user_email = $1',
      [req.user.email]
    );
    const favorites = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
});

// ========== ДОДАВАННЯ/ВИДАЛЕННЯ З ОБРАНОГО ==========
app.post('/favorites', authenticateToken, async (req, res) => {
  const { title, image, price, meta, badge, chips, category } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM favorites WHERE user_email = $1 AND title = $2',
      [req.user.email, title]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE id = $1', [existing.rows[0].id]);
      res.json({ success: true, message: 'Видалено з обраного', action: 'removed' });
    } else {
      const chipsJson = chips ? JSON.stringify(chips) : null;
      await pool.query(
        'INSERT INTO favorites (user_email, title, image, price, meta, badge, chips, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '']
      );
      res.json({ success: true, message: 'Додано в обране', action: 'added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
});

// ========== ОТРИМАННЯ БРОНЮВАНЬ ==========
app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = $1',
      [req.user.email]
    );
    const bookings = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
});

// ========== ДОДАВАННЯ БРОНЮВАННЯ ==========
app.post('/bookings', authenticateToken, async (req, res) => {
  const { title, image, price, meta, badge, chips, category, bookingDate } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  const chipsJson = chips ? JSON.stringify(chips) : null;
  const date = bookingDate || new Date().toLocaleDateString('uk-UA');

  try {
    await pool.query(
      'INSERT INTO bookings (user_email, title, image, price, meta, badge, chips, category, bookingDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '', date]
    );
    res.json({ success: true, message: 'Заброньовано успішно' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бронювання' });
  }
});

// ========== ВИДАЛЕННЯ БРОНЮВАННЯ ==========
app.delete('/bookings/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 AND user_email = $2',
      [id, req.user.email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Бронювання не знайдено' });
    }
    res.json({ success: true, message: 'Бронювання скасовано' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка видалення' });
  }
});

// ========== ВИДАЛЕННЯ АКАУНТА ==========
app.delete('/user', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE email = $1', [req.user.email]);
    res.json({ success: true, message: 'Акаунт видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка видалення акаунта' });
  }
});

// ========== АДМІНІСТРАТИВНІ ЕНДПОІНТИ ==========

// Отримання всіх турів певного типу
app.get('/admin/:type', authenticateAdmin, async (req, res) => {
  const { type } = req.params;
  const validTypes = ['tour', 'cruise', 'island', 'hot'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM tours WHERE type = $1 ORDER BY id DESC',
      [type]
    );
    
    // Парсимо JSON поля
    const items = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departuredates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    
    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// Додавання нового туру
app.post('/admin/:type', authenticateAdmin, async (req, res) => {
  const { type } = req.params;
  const validTypes = ['tour', 'cruise', 'island', 'hot'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }

  const {
    title, description, price, duration, groupSize,
    accommodation, badge, category, image, departureDates, chips, meta
  } = req.body;

  if (!title || !price) {
    return res.status(400).json({ success: false, message: 'Назва та ціна обов\'язкові' });
  }

  try {
    // Форматуємо дані
    const priceWithCurrency = price.toString().includes('грн') ? price : price + ' грн';
    
    // Якщо це число, додаємо текст
    const formattedDuration = duration && !isNaN(duration) ? duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів') : duration;
    const formattedGroup = groupSize && !isNaN(groupSize) ? groupSize + ' осіб' : groupSize;
    const formattedAccom = accommodation && !isNaN(accommodation) ? 'Готель ' + accommodation + '*' : accommodation;
    
    const result = await pool.query(
      `INSERT INTO tours (
        type, title, description, price, duration, groupSize, 
        accommodation, badge, category, image, departureDates, chips, meta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        type, title, description || '', priceWithCurrency, formattedDuration || '', 
        formattedGroup || '', formattedAccom || '', badge || '', category || '',
        image || '', JSON.stringify(departureDates || []), JSON.stringify(chips || []), meta || ''
      ]
    );
    
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('Помилка додавання:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера: ' + error.message });
  }
});

// Оновлення туру
app.put('/admin/:type/:id', authenticateAdmin, async (req, res) => {
  const { type, id } = req.params;
  const validTypes = ['tour', 'cruise', 'island', 'hot'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }

  const {
    title, description, price, duration, groupSize,
    accommodation, badge, category, image, departureDates, chips, meta
  } = req.body;

  try {
    let updates = [];
    let values = [];

    if (title !== undefined) { updates.push(`title = $${values.length+1}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${values.length+1}`); values.push(description); }
    if (price !== undefined) { 
      const priceWithCurrency = price.toString().includes('грн') ? price : price + ' грн';
      updates.push(`price = $${values.length+1}`); 
      values.push(priceWithCurrency); 
    }
    if (duration !== undefined) { 
      const formattedDuration = duration && !isNaN(duration) ? duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів') : duration;
      updates.push(`duration = $${values.length+1}`); 
      values.push(formattedDuration); 
    }
    if (groupSize !== undefined) { 
      const formattedGroup = groupSize && !isNaN(groupSize) ? groupSize + ' осіб' : groupSize;
      updates.push(`groupSize = $${values.length+1}`); 
      values.push(formattedGroup); 
    }
    if (accommodation !== undefined) { 
      const formattedAccom = accommodation && !isNaN(accommodation) ? 'Готель ' + accommodation + '*' : accommodation;
      updates.push(`accommodation = $${values.length+1}`); 
      values.push(formattedAccom); 
    }
    if (badge !== undefined) { updates.push(`badge = $${values.length+1}`); values.push(badge); }
    if (category !== undefined) { updates.push(`category = $${values.length+1}`); values.push(category); }
    if (image !== undefined) { updates.push(`image = $${values.length+1}`); values.push(image); }
    if (departureDates !== undefined) { updates.push(`departureDates = $${values.length+1}`); values.push(JSON.stringify(departureDates)); }
    if (chips !== undefined) { updates.push(`chips = $${values.length+1}`); values.push(JSON.stringify(chips)); }
    if (meta !== undefined) { updates.push(`meta = $${values.length+1}`); values.push(meta); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    values.push(id, type);
    const query = `UPDATE tours SET ${updates.join(', ')} WHERE id = $${values.length-1} AND type = $${values.length} RETURNING *`;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Тур не знайдено' });
    }
    
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// Видалення туру
app.delete('/admin/:type/:id', authenticateAdmin, async (req, res) => {
  const { type, id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM tours WHERE id = $1 AND type = $2 RETURNING id',
      [id, type]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Тур не знайдено' });
    }
    
    res.json({ success: true, message: 'Тур видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// Отримання списку всіх користувачів
app.get('/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, registered, role FROM users ORDER BY id DESC'
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// Зміна ролі користувача
app.put('/admin/users/:id/role', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Невірна роль' });
  }
  
  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ success: true, message: 'Роль оновлено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// Отримання всіх бронювань
app.get('/admin/bookings/all', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name as user_name, u.email as user_email 
       FROM bookings b 
       JOIN users u ON b.user_email = u.email 
       ORDER BY b.id DESC`
    );
    const bookings = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// ========== ПУБЛІЧНІ ЕНДПОІНТИ ДЛЯ ОТРИМАННЯ ТУРІВ ==========
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'tour' ORDER BY id DESC");
    const tours = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departuredates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cruises', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'cruise' ORDER BY id DESC");
    const cruises = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departuredates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    res.json(cruises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/islands', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'island' ORDER BY id DESC");
    const islands = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departuredates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    res.json(islands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/hot', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'hot' ORDER BY id DESC");
    const hot = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departuredates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    res.json(hot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== ГОЛОВНА СТОРІНКА API ==========
app.get('/', (req, res) => {
  res.send('Oceanica Travel API is running');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});