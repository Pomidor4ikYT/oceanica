// server/database/init.js
const { run } = require('./db');

async function initTables() {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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

    await run(`
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
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
      )
    `);

    await run(`
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
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиці створено');
  } catch (err) {
    console.error('❌ Помилка створення таблиць:', err);
  }
}

module.exports = { initTables };