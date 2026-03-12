// server/controllers/favoritesController.js
const { query } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

async function getFavorites(req, res) {
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await query(
        'SELECT title, image, price, meta, badge, chips, category FROM favorites WHERE user_email = $1',
        [req.user.email]
      );
      const favorites = result.rows.map(row => ({
        ...row,
        chips: safeJsonParse(row.chips, [])
      }));
      res.json({ success: true, favorites });
    } else {
      result = await query(
        'SELECT title, image, price, meta, badge, chips, category FROM favorites WHERE user_email = ?',
        [req.user.email]
      );
      const favorites = result.map(row => ({
        ...row,
        chips: safeJsonParse(row.chips, [])
      }));
      res.json({ success: true, favorites });
    }
  } catch (error) {
    console.error('❌ Помилка отримання улюблених:', error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

async function toggleFavorite(req, res) {
  const { title, image, price, meta, badge, chips, category } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  try {
    // Перевіряємо чи вже є в обраному
    let existing;
    if (process.env.NODE_ENV === 'production') {
      const result = await query(
        'SELECT id FROM favorites WHERE user_email = $1 AND title = $2',
        [req.user.email, title]
      );
      existing = result.rows[0];
    } else {
      const result = await query(
        'SELECT id FROM favorites WHERE user_email = ? AND title = ?',
        [req.user.email, title]
      );
      existing = result[0];
    }

    if (existing) {
      // Видаляємо
      if (process.env.NODE_ENV === 'production') {
        await query('DELETE FROM favorites WHERE id = $1', [existing.id]);
      } else {
        await query('DELETE FROM favorites WHERE id = ?', [existing.id]);
      }
      res.json({ success: true, message: 'Видалено з обраного', action: 'removed' });
    } else {
      // Додаємо
      const chipsJson = chips ? JSON.stringify(chips) : null;
      
      if (process.env.NODE_ENV === 'production') {
        await query(
          'INSERT INTO favorites (user_email, title, image, price, meta, badge, chips, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '']
        );
      } else {
        await query(
          'INSERT INTO favorites (user_email, title, image, price, meta, badge, chips, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '']
        );
      }
      res.json({ success: true, message: 'Додано в обране', action: 'added' });
    }
  } catch (error) {
    console.error('❌ Помилка toggleFavorite:', error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

module.exports = {
  getFavorites,
  toggleFavorite
};