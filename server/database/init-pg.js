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
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця users створена');
    
    // Створення таблиці tours
    await query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        duration INTEGER,
        location VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця tours створена');
    
    // Створення таблиці bookings
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
        booking_date DATE NOT NULL,
        participants INTEGER DEFAULT 1,
        total_price DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблиця bookings створена');
    
    // Створення таблиці favorites
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, tour_id)
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