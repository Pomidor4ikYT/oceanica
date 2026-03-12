// server/database/init-pg.js
const { query } = require('./db');

async function initPostgreSQL() {
  console.log('🔄 Ініціалізація PostgreSQL...');
  
  try {
    // Створення таблиці users
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        registered VARCHAR(50),
        bio TEXT,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця users створена');
    
    // Створення таблиці tours (з колонкою meta)
    await query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price VARCHAR(100),
        duration VARCHAR(100),
        groupSize VARCHAR(100),
        accommodation VARCHAR(255),
        badge VARCHAR(100),
        category VARCHAR(100),
        image TEXT,
        departureDates JSONB DEFAULT '[]',
        chips JSONB DEFAULT '[]',
        meta TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця tours створена');
    
    // Створення таблиці bookings
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(100),
        image TEXT,
        badge VARCHAR(100),
        chips JSONB DEFAULT '[]',
        meta VARCHAR(255),
        category VARCHAR(100),
        booking_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця bookings створена');
    
    // Створення таблиці favorites
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(100),
        image TEXT,
        badge VARCHAR(100),
        chips JSONB DEFAULT '[]',
        meta VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, title)
      )
    `);
    console.log('✅ Таблиця favorites створена');
    
    console.log('🎉 Ініціалізація PostgreSQL завершена успішно!');
  } catch (error) {
    console.error('❌ Помилка ініціалізації PostgreSQL:', error);
    throw error;
  }
}

// Запускаємо якщо файл викликано напряму
if (require.main === module) {
  initPostgreSQL()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initPostgreSQL;