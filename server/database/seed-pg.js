// server/database/seed-pg.js
const bcrypt = require('bcryptjs');
const { query } = require('./db');

async function seedPostgreSQL() {
  console.log('🌱 Додаємо початкові дані...');

  try {
    // Перевіряємо чи є адмін
    const adminExists = await query('SELECT email FROM users WHERE email = $1', ['admintest1@gmail.com']);
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admintest1', 10);
      const registered = new Date().toLocaleDateString('uk-UA');
      await query(
        'INSERT INTO users (name, email, password, registered, role) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', 'admintest1@gmail.com', hashedPassword, registered, 'admin']
      );
      console.log('✅ Адміністратора створено');
    } else {
      console.log('ℹ️ Адмін вже існує');
    }

    // Перевіряємо чи є тури
    const toursCount = await query('SELECT COUNT(*) FROM tours');
    if (parseInt(toursCount.rows[0].count) === 0) {
      await query(`
        INSERT INTO tours (type, title, description, price, duration, "groupSize", accommodation, badge, category, image, "departureDates", chips, meta)
        VALUES 
          ('tour', 'Таїланд: Пхукет & Пхі-Пхі', 'Райські пляжі Таїланду', '39900 грн', '10 ночей', '25 осіб', 'Готель 4*', '🏖️Пляжний', 'beach', 'styles/img/tours/tour1.jpg', '["15.03.2026","22.03.2026","05.04.2026"]', '["Пальми","Вапнякові скелі","Дайвінг"]', '10 днів • All Inclusive'),
          ('tour', 'Італія: Рим, Флоренція, Венеція', 'Класичний тур по Італії', '31200 грн', '8 днів', '30 осіб', 'Готель 3-4*', '🏛️Екскурсійний', 'excursion', 'styles/img/tours/tour2.jpg', '["10.04.2026","24.04.2026","08.05.2026"]', '["Колізей","Да Вінчі","Гондоли"]', '8 днів • сніданки'),
          ('cruise', 'Середземне море', 'Круїз Середземним морем', '42500 грн', '7 ночей', '200 осіб', 'Лайнер', '☀️ Теплі води', 'warm', 'styles/img/cruise/cruise1.jpg', '["15.03.2026","22.03.2026","05.04.2026"]', '["Італія","Греція","Іспанія"]', '7 ночей')
      `);
      console.log('✅ Початкові тури додано');
    } else {
      console.log('ℹ️ Тури вже існують');
    }

    console.log('🎉 Seed завершено успішно!');
  } catch (error) {
    console.error('❌ Помилка seed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedPostgreSQL()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedPostgreSQL;