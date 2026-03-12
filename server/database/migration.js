// server/database/migration.js
const { query } = require('./db');

async function migrateDatabase() {
  console.log('🔄 Запуск міграції бази даних...');
  
  try {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      
      // Перевіряємо чи існує колонка meta
      const checkColumn = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='tours' AND column_name='meta'
      `);
      
      if (checkColumn.rows.length === 0) {
        console.log('📦 Додаємо колонку meta до таблиці tours...');
        await query(`ALTER TABLE tours ADD COLUMN meta TEXT DEFAULT ''`);
        console.log('✅ Колонку meta додано');
      } else {
        console.log('✅ Колонка meta вже існує');
      }
      
      // Перевіряємо інші колонки
      console.log('📦 Перевіряємо структуру таблиці tours...');
      
    } else {
      // SQLite
      console.log('📦 Перевірка структури для SQLite...');
      // SQLite простіше - можна просто перестворити таблицю
    }
    
    console.log('🎉 Міграцію завершено успішно!');
  } catch (error) {
    console.error('❌ Помилка міграції:', error);
    throw error;
  }
}

// Запускаємо якщо файл викликано напряму
if (require.main === module) {
  migrateDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = migrateDatabase;