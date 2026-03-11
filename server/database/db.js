const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

if (process.env.NODE_ENV === 'production') {
  // Використовуємо PostgreSQL на Render
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  db = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end()
  };
} else {
  // Використовуємо SQLite для локальної розробки
  const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, '../database.sqlite');
  db = new sqlite3.Database(sqlitePath, (err) => {
    if (err) {
      console.error('Error connecting to SQLite:', err);
    } else {
      console.log('Connected to SQLite database');
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