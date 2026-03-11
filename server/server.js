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

// Підключення до PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // важливо для Render
  }
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
        bio TEXT,
        role TEXT DEFAULT 'user'
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
  } catch (err) {
    console.error('❌ Помилка створення таблиць:', err);
  }
}

// Створення тестового адміністратора
async function createAdminUser() {
  try {
    // Перевіряємо, чи існує адміністратор
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
      // Оновлюємо роль до адміністратора, якщо потрібно
      await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admintest1@gmail.com'");
      console.log('✅ Роль оновлено до адміністратора');
    }
  } catch (error) {
    console.error('Помилка створення адміністратора:', error);
  }
}

// Викликаємо ініціалізацію при запуску
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

// ========== ІНШІ ЕНДПОІНТИ (додайте їх сюди) ==========
// Тут мають бути всі інші ендпоінти з вашого оригінального server.js
// (GET /user, PUT /user, /favorites, /bookings, /admin/* тощо)

// ========== ГОЛОВНА СТОРІНКА API ==========
app.get('/', (req, res) => {
  res.send('Oceanica Travel API is running');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});