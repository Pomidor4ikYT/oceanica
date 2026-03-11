// server/database/db.js
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const fs = require('fs');
const { USE_POSTGRES, DB_PATH } = require('../config/constants');

let db;
let query, run, get;

if (USE_POSTGRES) {
  console.log('📦 Використовуємо PostgreSQL');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  query = async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return { rows: result.rows };
    } catch (error) {
      console.error('❌ Помилка запиту:', error);
      throw error;
    }
  };
  
  run = async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return { lastID: result.rows[0]?.id, changes: result.rowCount };
    } catch (error) {
      console.error('❌ Помилка виконання:', error);
      throw error;
    }
  };
  
  get = async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Помилка отримання:', error);
      throw error;
    }
  };
  
} else {
  console.log('📦 Використовуємо SQLite (локальний режим)');
  
  const dbExists = fs.existsSync(DB_PATH);
  
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('❌ Помилка підключення до SQLite:', err.message);
    } else {
      console.log('✅ Підключено до SQLite');
      if (!dbExists) console.log('📝 Створено нову базу даних');
    }
  });
  
  query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    });
  };
  
  run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
  
  get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
}

module.exports = {
  query,
  run,
  get,
  USE_POSTGRES
};