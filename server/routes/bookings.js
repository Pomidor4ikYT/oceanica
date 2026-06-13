// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getBookings,
  addBooking,
  deleteBooking
} = require('../controllers/bookingsController');

// Видаляємо зайвий префікс '/bookings' – використовуємо кореневий маршрут
router.get('/', authenticateToken, getBookings);
router.post('/', authenticateToken, addBooking);
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;