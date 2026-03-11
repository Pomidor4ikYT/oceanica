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

// Базовий маршрут для перевірки - ДОДАЙТЕ ЦЕ
app.get('/', (req, res) => {
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
    },
    timestamp: new Date().toISOString()
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

// Підключаємо маршрути
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/user'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/favorites', require('./routes/favorites'));
  
  console.log('✅ Маршрути підключено успішно');
} catch (error) {
  console.error('❌ Помилка підключення маршрутів:', error.message);
}

// Обробка 404 - ЦЕ МАЄ БУТИ В КІНЦІ
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут не знайдено: ${req.originalUrl}`
  });
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  console.error('❌ Помилка сервера:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутрішня помилка сервера';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Запускаємо сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 Сервер успішно запущено!');
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🌍 Середовище: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Обробка неочікуваних помилок
process.on('uncaughtException', (error) => {
  console.error('❌ Необроблена помилка:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Необроблений проміс:', error);
  process.exit(1);
});

module.exports = app;