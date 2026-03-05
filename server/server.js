// server/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Важливо: Render надасть свій PORT
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this'; // Краще використовувати змінну оточення

// Middleware
app.use(cors());
app.use(express.json());

// Статичні файли – публічна папка (на рівень вище)
app.use(express.static(path.join(__dirname, '../public')));

// Шлях до бази даних – в папці server (або можна зберігати в /tmp, але SQLite файл краще в постійному сховищі)
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Створення таблиць (той самий код)
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

// ... решта API коду без змін ...
// (весь код обробників залишається таким же)

// Важливо: додайте обробник для кореневого маршруту, щоб перевіряти, що сервер працює
app.get('/', (req, res) => {
  res.send('Oceanica Travel API is running');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
  console.log(`Статичні файли з папки: ${path.join(__dirname, '../public')}`);
});