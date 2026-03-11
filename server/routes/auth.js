// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const {
  register,
  login,
  getUserData,
  updateUser,
  deleteUser
} = require('../controllers/authController');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/user', authenticateToken, getUserData);
router.put('/user', authenticateToken, updateUser);
router.delete('/user', authenticateToken, deleteUser);

module.exports = router;