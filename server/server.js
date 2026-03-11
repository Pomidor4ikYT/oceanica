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

// ✅ Віддаємо статичні файли з папки public (фронтенд)
app.use(express.static(path.join(__dirname, '../public')));

// API маршрути
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/favorites', require('./routes/favorites'));

// Базовий маршрут для API інформації (не обов'язково, але можна залишити)
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

// ✅ ВАЖЛИВО: Всі інші запити віддаємо index.html (для підтримки маршрутів фронтенду)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запускаємо сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 Сервер успішно запущено!');
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🌍 Середовище: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Фронтенд: public папка`);
  console.log(`🔗 URL: https://oceanica-0m18.onrender.com\n`);
});

module.exports = app;