// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/admin');
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getUsers,
  updateUserRole,
  getAllBookings
} = require('../controllers/adminController');

// Управління турами
router.get('/:type', authenticateAdmin, getItems);
router.post('/:type', authenticateAdmin, addItem);
router.put('/:type/:id', authenticateAdmin, updateItem);
router.delete('/:type/:id', authenticateAdmin, deleteItem);

// Управління користувачами
router.get('/users', authenticateAdmin, getUsers);
router.put('/users/:id/role', authenticateAdmin, updateUserRole);

// Всі бронювання
router.get('/bookings/all', authenticateAdmin, getAllBookings);

module.exports = router;