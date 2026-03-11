// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getBookings,
  addBooking,
  deleteBooking
} = require('../controllers/bookingsController');

router.get('/bookings', authenticateToken, getBookings);
router.post('/bookings', authenticateToken, addBooking);
router.delete('/bookings/:id', authenticateToken, deleteBooking);

module.exports = router;