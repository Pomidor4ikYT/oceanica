// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли фронтенду
app.use(express.static(path.join(__dirname, '../public')));

// API маршрути
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/favorites', require('./routes/favorites'));

// Базовий маршрут для інформації про API
app.get('/api', (req, res) => {
  res.json({
    message: 'Oceanica API Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
      bookings: '/api/bookings',
      favorites: '/api/favorites'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    environment: process.env.NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Віддаємо index.html для будь-яких інших запитів (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Функція ініціалізації бази даних (тільки в production)
async function initializeDatabase() {
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Перевірка/створення таблиць PostgreSQL...');
    try {
      const initDB = require('./database/init-pg');
      await initDB();
      console.log('✅ Таблиці готові');
    } catch (err) {
      console.error('❌ Помилка ініціалізації БД:', err);
      // Не зупиняємо сервер, але логуємо критичну помилку
    }
  } else {
    console.log('ℹ️ Розробка: використовується SQLite, ініціалізація не потрібна');
  }
}

// Запуск сервера після ініціалізації БД
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 Сервер успішно запущено!');
    console.log(`📡 Порт: ${PORT}`);
    console.log(`🌍 Середовище: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Фронтенд: public папка`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`🐘 База даних: PostgreSQL (${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'підключено'})`);
    } else {
      console.log(`🗄️ База даних: SQLite (локальна)`);
    }
    console.log(`🔗 URL: https://oceanica-0m18.onrender.com\n`);
  });
}).catch(err => {
  console.error('❌ Критична помилка при ініціалізації БД:', err);
  process.exit(1);
});

module.exports = app;