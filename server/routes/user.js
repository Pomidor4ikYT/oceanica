// server/routes/user.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getUserProfile,
  getUserStats
} = require('../controllers/userController');

router.get('/profile', authenticateToken, getUserProfile);
router.get('/stats', authenticateToken, getUserStats);

module.exports = router;