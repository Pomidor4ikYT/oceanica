// server/database/db.js
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

if (process.env.NODE_ENV === 'production') {
  // Використовуємо PostgreSQL на Render
  console.log('📦 Використання PostgreSQL в production режимі');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  // Перевіряємо з'єднання
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ Помилка підключення до PostgreSQL:', err.stack);
    } else {
      console.log('✅ Підключено до PostgreSQL');
      release();
    }
  });
  
  db = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end()
  };
} else {
  // Використовуємо SQLite для локальної розробки
  console.log('📦 Використання SQLite в development режимі');
  const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, '../database.sqlite');
  
  db = new sqlite3.Database(sqlitePath, (err) => {
    if (err) {
      console.error('❌ Помилка підключення до SQLite:', err);
    } else {
      console.log('✅ Підключено до SQLite бази даних');
    }
  });
  
  // Обгортаємо SQLite методи для зручності
  db.query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
}

module.exports = db;