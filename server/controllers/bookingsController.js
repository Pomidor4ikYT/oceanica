// server/controllers/bookingsController.js
const { query, run } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

async function getBookings(req, res) {
  try {
    const result = await query(
      'SELECT id, title, image, price, meta, badge, chips, category, bookingDate FROM bookings WHERE user_email = ?',
      [req.user.email]
    );
    const bookings = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
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
    await run(
      'INSERT INTO bookings (user_email, title, image, price, meta, badge, chips, category, bookingDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.email, title, image || '', price || '', meta || '', badge || '', chipsJson, category || '', date]
    );
    res.json({ success: true, message: 'Заброньовано успішно' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бронювання' });
  }
}

async function deleteBooking(req, res) {
  const id = req.params.id;
  try {
    const result = await run(
      'DELETE FROM bookings WHERE id = ? AND user_email = ?',
      [id, req.user.email]
    );
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Бронювання не знайдено' });
    }
    res.json({ success: true, message: 'Бронювання скасовано' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка видалення' });
  }
}

module.exports = {
  getBookings,
  addBooking,
  deleteBooking
};