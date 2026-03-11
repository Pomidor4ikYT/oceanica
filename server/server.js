// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initTables } = require('./database/init');
const { createAdminUser, seedInitialData } = require('./database/seed');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== СТАТИЧНІ ФАЙЛИ ==========
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../public')));

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Логування запитів
app.use((req, res, next) => {
  logger.api(`${req.method} ${req.url}`);
  next();
});

// ========== ІНІЦІАЛІЗАЦІЯ БАЗИ ДАНИХ ==========
(async () => {
  try {
    await initTables();
    await createAdminUser();
    await seedInitialData();
    logger.success('База даних ініціалізована');
  } catch (error) {
    logger.error('Помилка ініціалізації бази даних:', error);
  }
})();

// ========== ПІДКЛЮЧЕННЯ МАРШРУТІВ ==========
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/favorites'));
app.use('/', require('./routes/bookings'));
app.use('/', require('./routes/user'));      // новий маршрут
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// ========== ОБРОБКА ПОМИЛОК 404 ==========
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Маршрут не знайдено' 
  });
});

// ========== ОБРОБКА ПОМИЛОК СЕРВЕРА ==========
app.use((err, req, res, next) => {
  logger.error('Помилка сервера:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Внутрішня помилка сервера' 
  });
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(PORT, () => {
  logger.success(`🚀 Сервер запущено на порту ${PORT}`);
  const { USE_POSTGRES } = require('./database/db');
  logger.info(USE_POSTGRES ? '🌐 Режим: PostgreSQL (продакшн)' : '💻 Режим: SQLite (локальний)');
});