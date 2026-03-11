// server/controllers/userController.js
const { get } = require('../database/db');

async function getUserProfile(req, res) {
  try {
    const user = await get(
      'SELECT name, email, phone, registered, bio, role FROM users WHERE email = ?',
      [req.user.email]
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Помилка отримання профілю:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getUserStats(req, res) {
  try {
    const user = await get('SELECT role FROM users WHERE email = ?', [req.user.email]);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }
    
    res.json({ 
      success: true, 
      stats: {
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Помилка отримання статистики:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

module.exports = {
  getUserProfile,
  getUserStats
};