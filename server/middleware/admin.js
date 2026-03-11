// server/middleware/admin.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/constants');
const { get } = require('../database/db');

async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Токен відсутній' });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    console.log('🔍 Перевірка адміністратора для:', user.email);
    
    const result = await get('SELECT role FROM users WHERE email = ?', [user.email]);
    const userRole = result?.role;
    
    console.log('👤 Роль в базі:', userRole);
    
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Помилка перевірки токена:', err);
    return res.status(403).json({ success: false, message: 'Недійсний токен' });
  }
}

module.exports = { authenticateAdmin };