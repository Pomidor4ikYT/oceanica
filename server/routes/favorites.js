// server/routes/favorites.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getFavorites,
  toggleFavorite
} = require('../controllers/favoritesController');

router.get('/favorites', authenticateToken, getFavorites);
router.post('/favorites', authenticateToken, toggleFavorite);

module.exports = router;