// server/controllers/favoritesController.js
const { query, run, get } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

async function getFavorites(req, res) {
  try {
    const result = await query(
      'SELECT title, image, price, meta, badge, chips, category FROM favorites WHERE user_email = ?',
      [req.user.email]
    );
    const favorites = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

async function toggleFavorite(req, res) {
  const { title, image, price, meta, badge, chips, category } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  try {
    const existing = await get(
      'SELECT id FROM favorites WHERE user_email = ? AND title = ?',
      [req.user.email, title]
    );

    if (existing) {
      await run('DELETE FROM favorites WHERE id = ?', [existing.id]);
      res.json({ success: true, message: 'Видалено з обраного', action: 'removed' });
    } else {
      const chipsJson = chips ? JSON.stringify(chips) : null;
      await run(
        'INSERT INTO favorites (user_email, title, image, price, meta, badge, chips, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '']
      );
      res.json({ success: true, message: 'Додано в обране', action: 'added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

module.exports = {
  getFavorites,
  toggleFavorite
};