// server/routes/favorites.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getFavorites,
  toggleFavorite
} = require('../controllers/favoritesController');

// Змінюємо '/favorites' на '/'
router.get('/', authenticateToken, getFavorites);
router.post('/', authenticateToken, toggleFavorite);

module.exports = router;