// server/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Статичні файли (фронтенд)
app.use(express.static(path.join(__dirname, '../public')));

// Шлях до бази даних
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Створення таблиць (якщо їх ще немає)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      registered TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      title TEXT NOT NULL,
      image TEXT,
      price TEXT,
      meta TEXT,
      badge TEXT,
      chips TEXT,
      category TEXT,
      FOREIGN KEY (user_email) REFERENCES users(email)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      title TEXT NOT NULL,
      image TEXT,
      price TEXT,
      meta TEXT,
      badge TEXT,
      chips TEXT,
      category TEXT,
      bookingDate TEXT,
      FOREIGN KEY (user_email) REFERENCES users(email)
    )
  `);
});

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
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Помилка бази даних' });
      }
      if (row) {
        return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const registered = new Date().toLocaleDateString('uk-UA');

      db.run(
        'INSERT INTO users (name, email, phone, password, registered) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || '', hashedPassword, registered],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Помилка створення користувача' });
          }

          const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: '7d' });
          res.json({
            success: true,
            token,
            user: { name, email, phone: phone || '', registered }
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// ========== ВХІД ==========
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Введіть email та пароль' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }
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
        registered: user.registered
      }
    });
  });
});

// ========== ОТРИМАННЯ ДАНИХ КОРИСТУВАЧА ==========
app.get('/user', authenticateToken, (req, res) => {
  db.get('SELECT name, email, phone, registered FROM users WHERE email = ?', [req.user.email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }
    res.json({ success: true, user });
  });
});

// ========== ОТРИМАННЯ ОБРАНОГО ==========
app.get('/favorites', authenticateToken, (req, res) => {
  db.all('SELECT title, image, price, meta, badge, chips, category FROM favorites WHERE user_email = ?', [req.user.email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }
    // Розпарсити chips (якщо зберігали як JSON)
    const favorites = rows.map(row => ({
      ...row,
      chips: row.chips ? JSON.parse(row.chips) : []
    }));
    res.json({ success: true, favorites });
  });
});

// ========== ДОДАВАННЯ/ВИДАЛЕННЯ З ОБРАНОГО ==========
app.post('/favorites', authenticateToken, (req, res) => {
  const { title, image, price, meta, badge, chips, category } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  db.get('SELECT id FROM favorites WHERE user_email = ? AND title = ?', [req.user.email, title], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }

    if (row) {
      // Видаляємо
      db.run('DELETE FROM favorites WHERE id = ?', [row.id], function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Помилка видалення' });
        }
        res.json({ success: true, message: 'Видалено з обраного', action: 'removed' });
      });
    } else {
      // Додаємо
      const chipsJson = chips ? JSON.stringify(chips) : null;
      db.run(
        'INSERT INTO favorites (user_email, title, image, price, meta, badge, chips, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || ''],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Помилка додавання' });
          }
          res.json({ success: true, message: 'Додано в обране', action: 'added' });
        }
      );
    }
  });
});

// ========== ОТРИМАННЯ БРОНЮВАНЬ ==========
app.get('/bookings', authenticateToken, (req, res) => {
  db.all('SELECT title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = ?', [req.user.email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка бази даних' });
    }
    const bookings = rows.map(row => ({
      ...row,
      chips: row.chips ? JSON.parse(row.chips) : []
    }));
    res.json({ success: true, bookings });
  });
});

// ========== ДОДАВАННЯ БРОНЮВАННЯ ==========
app.post('/bookings', authenticateToken, (req, res) => {
  const { title, image, price, meta, badge, chips, category, bookingDate } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  const chipsJson = chips ? JSON.stringify(chips) : null;
  const date = bookingDate || new Date().toLocaleDateString('uk-UA');

  db.run(
    'INSERT INTO bookings (user_email, title, image, price, meta, badge, chips, category, bookingDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '', date],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Помилка бронювання' });
      }
      res.json({ success: true, message: 'Заброньовано успішно' });
    }
  );
});

// ========== ВИДАЛЕННЯ БРОНЮВАННЯ ==========
app.delete('/bookings/:title', authenticateToken, (req, res) => {
  const title = decodeURIComponent(req.params.title);

  db.run('DELETE FROM bookings WHERE user_email = ? AND title = ?', [req.user.email, title], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Помилка видалення' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Бронювання не знайдено' });
    }
    res.json({ success: true, message: 'Бронювання скасовано' });
  });
});

// ========== ПЕРЕВІРКА, ЩО СЕРВЕР ПРАЦЮЄ ==========
app.get('/', (req, res) => {
  res.send('Oceanica Travel API is running');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
  console.log(`Статичні файли з папки: ${path.join(__dirname, '../public')}`);
});