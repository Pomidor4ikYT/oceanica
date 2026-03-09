// server/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this'; // обов'язково змінити в продакшені!

// Підключення до PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ========== Ініціалізація таблиць ==========
async function initDb() {
  try {
    // Таблиця користувачів
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        registered TEXT NOT NULL,
        bio TEXT
      )
    `);

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

    // Таблиця турів (для динамічного завантаження)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL, -- 'tour', 'cruise', 'island'
        title TEXT NOT NULL,
        description TEXT,
        price TEXT,
        duration TEXT,
        groupSize TEXT,
        accommodation TEXT,
        badge TEXT,
        category TEXT,
        image TEXT,
        departureDates TEXT, -- JSON масив
        chips TEXT -- JSON масив
      )
    `);

    console.log('✅ Таблиці створено або вже існують');
  } catch (err) {
    console.error('❌ Помилка створення таблиць:', err);
  }
}
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
      'INSERT INTO users (name, email, phone, password, registered) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone || '', hashedPassword, registered]
    );

    const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { name, email, phone: phone || '', registered }
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
        bio: user.bio || ''
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
    const result = await pool.query('SELECT name, email, phone, registered, bio FROM users WHERE email = $1', [req.user.email]);
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
    // Перевірка, чи новий email не зайнятий іншим користувачем
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
      chips: row.chips ? JSON.parse(row.chips) : []
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
      'SELECT title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = $1',
      [req.user.email]
    );
    const bookings = result.rows.map(row => ({
      ...row,
      chips: row.chips ? JSON.parse(row.chips) : []
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

// ========== ЕНДПОІНТИ ДЛЯ ОТРИМАННЯ ТУРІВ ==========
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'tour'");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cruises', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'cruise'");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/islands', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours WHERE type = 'island'");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// (Опціонально) ендпоінт для пошуку за датою (можна реалізувати пізніше)

// ========== ГОЛОВНА СТОРІНКА API ==========
app.get('/', (req, res) => {
  res.send('Oceanica Travel API is running');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
  console.log(`Статичні файли з папки: ${path.join(__dirname, '../public')}`);
});