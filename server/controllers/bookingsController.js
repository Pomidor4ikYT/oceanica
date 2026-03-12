// server/controllers/bookingsController.js
const { query } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

async function getBookings(req, res) {
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await query(
        'SELECT id, title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = $1',
        [req.user.email]
      );
      const bookings = result.rows.map(row => ({
        ...row,
        chips: safeJsonParse(row.chips, [])
      }));
      res.json({ success: true, bookings });
    } else {
      result = await query(
        'SELECT id, title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = ?',
        [req.user.email]
      );
      const bookings = result.map(row => ({
        ...row,
        chips: safeJsonParse(row.chips, [])
      }));
      res.json({ success: true, bookings });
    }
  } catch (error) {
    console.error('❌ Помилка отримання бронювань:', error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

async function addBooking(req, res) {
  const { title, image, price, meta, badge, chips, category, bookingDate } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Назва обов\'язкова' });
  }

  const chipsJson = chips ? JSON.stringify(chips) : null;
  const date = bookingDate || new Date().toLocaleDateString('uk-UA');

  try {
    if (process.env.NODE_ENV === 'production') {
      await query(
        'INSERT INTO bookings (user_email, title, image, price, meta, badge, chips, category, bookingDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '', date]
      );
    } else {
      await query(
        'INSERT INTO bookings (user_email, title, image, price, meta, badge, chips, category, bookingDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '', date]
      );
    }
    res.json({ success: true, message: 'Заброньовано успішно' });
  } catch (error) {
    console.error('❌ Помилка додавання бронювання:', error);
    res.status(500).json({ success: false, message: 'Помилка бронювання' });
  }
}

async function deleteBooking(req, res) {
  const id = req.params.id;
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await query(
        'DELETE FROM bookings WHERE id = $1 AND user_email = $2',
        [id, req.user.email]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Бронювання не знайдено' });
      }
    } else {
      result = await query(
        'DELETE FROM bookings WHERE id = ? AND user_email = ?',
        [id, req.user.email]
      );
      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Бронювання не знайдено' });
      }
    }
    res.json({ success: true, message: 'Бронювання скасовано' });
  } catch (error) {
    console.error('❌ Помилка видалення бронювання:', error);
    res.status(500).json({ success: false, message: 'Помилка видалення' });
  }
}

module.exports = {
  getBookings,
  addBooking,
  deleteBooking
};