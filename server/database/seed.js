// server/database/seed.js
const bcrypt = require('bcryptjs');
const { run, get } = require('./db');

async function createAdminUser() {
  try {
    const user = await get("SELECT email FROM users WHERE email = ?", ['admintest1@gmail.com']);
    
    if (!user) {
      const hashedPassword = await bcrypt.hash('admintest1', 10);
      const registered = new Date().toLocaleDateString('uk-UA');
      
      await run(
        'INSERT INTO users (name, email, password, registered, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'admintest1@gmail.com', hashedPassword, registered, 'admin']
      );
      console.log('✅ Адміністратора створено');
    } else {
      await run("UPDATE users SET role = ? WHERE email = ?", ['admin', 'admintest1@gmail.com']);
      console.log('✅ Роль оновлено до адміністратора');
    }
  } catch (error) {
    console.error('Помилка створення адміністратора:', error);
  }
}

async function seedInitialData() {
  try {
    const toursCount = await get("SELECT COUNT(*) as count FROM tours WHERE type = 'tour'");
    
    if (!toursCount || toursCount.count === 0) {
      console.log('📝 Додаємо початкові тури...');
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['tour', 'Таїланд: Пхукет & Пхі-Пхі', 'Райські пляжі Таїланду', '39900 грн', '10 ночей', '25 осіб', 'Готель 4*', '🏖️Пляжний', 'beach', 'styles/img/tours/tour1.jpg', JSON.stringify(['15.03.2026', '22.03.2026', '05.04.2026']), JSON.stringify(['Пальми', 'Вапнякові скелі', 'Дайвінг']), '10 днів • All Inclusive']
      );
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['tour', 'Італія: Рим, Флоренція, Венеція', 'Класичний тур по Італії', '31200 грн', '8 днів', '30 осіб', 'Готель 3-4*', '🏛️Екскурсійний', 'excursion', 'styles/img/tours/tour2.jpg', JSON.stringify(['10.04.2026', '24.04.2026', '08.05.2026']), JSON.stringify(['Колізей', 'Да Вінчі', 'Гондоли']), '8 днів • сніданки']
      );
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['tour', 'Непал: Еверест та храми', 'Треккінг до Евересту', '47500 грн', '12 днів', '15 осіб', 'Кемп', '⛰️Гірський', 'mountain', 'styles/img/tours/tour3.jpg', JSON.stringify(['20.03.2026', '03.04.2026', '17.04.2026']), JSON.stringify(['Гімалаї', 'Буддизм', 'Базовий табір']), '12 днів • Trekking']
      );
      
      console.log('✅ Початкові тури додано');
    }

    const cruisesCount = await get("SELECT COUNT(*) as count FROM tours WHERE type = 'cruise'");
    if (!cruisesCount || cruisesCount.count === 0) {
      console.log('📝 Додаємо початкові круїзи...');
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['cruise', 'Середземне море', 'Круїз Середземним морем', '42500 грн', '7 ночей', '200 осіб', 'Лайнер', '☀️ Теплі води', 'warm', 'styles/img/cruise/cruise1.jpg', JSON.stringify(['15.03.2026', '22.03.2026', '05.04.2026']), JSON.stringify(['Італія', 'Греція', 'Іспанія']), '7 ночей']
      );
      
      console.log('✅ Початкові круїзи додано');
    }

    const islandsCount = await get("SELECT COUNT(*) as count FROM tours WHERE type = 'island'");
    if (!islandsCount || islandsCount.count === 0) {
      console.log('📝 Додаємо початкові острови...');
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['island', 'Мальдіви', 'Райські острови', '67800 грн', '7 ночей', '10 осіб', 'Готель 5*', '🏝️ Тропічний', 'tropical', 'styles/img/island/island1.jpg', JSON.stringify(['05.03.2026', '12.03.2026', '19.03.2026']), JSON.stringify(['Вілли', 'Дайвінг', 'SPA']), '7 ночей']
      );
      
      console.log('✅ Початкові острови додано');
    }

    const hotCount = await get("SELECT COUNT(*) as count FROM tours WHERE type = 'hot'");
    if (!hotCount || hotCount.count === 0) {
      console.log('📝 Додаємо початкові гарячі путівки...');
      
      await run(
        `INSERT INTO tours (type, title, description, price, duration, groupSize, accommodation, badge, category, image, departureDates, chips, meta) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['hot', 'Єгипет All Inclusive', 'Гаряча пропозиція', '23960 грн', '7 ночей', '40 осіб', 'Готель 5*', '-20%', 'beach', 'styles/img/index/bar1.jpg', JSON.stringify(['01.11.2026', '08.11.2026', '15.11.2026']), JSON.stringify(['Піраміди', 'Червоне море', 'All Inclusive']), '7 ночей']
      );
      
      console.log('✅ Початкові гарячі путівки додано');
    }
  } catch (error) {
    console.error('❌ Помилка додавання початкових даних:', error);
  }
}

module.exports = {
  createAdminUser,
  seedInitialData
};