// server/middleware/admin.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/constants');
const { query } = require('../database/db');

async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Токен відсутній' });
  }

// server/middleware/admin.js (фрагмент)
try {
  const user = jwt.verify(token, SECRET_KEY);
  let userRole;
  if (process.env.NODE_ENV === 'production') {
    const result = await query('SELECT role FROM users WHERE email = $1', [user.email]);
    userRole = result.rows?.[0]?.role;
  } else {
    const result = await query('SELECT role FROM users WHERE email = ?', [user.email]);
    userRole = result?.[0]?.role;
  }
  if (userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Доступ заборонено. Потрібні права адміністратора' });
  }
  req.user = user;
  next();
} catch (err) {
  console.error('❌ Помилка перевірки адміністратора:', err);
  return res.status(403).json({ success: false, message: 'Недійсний токен' });
}
}

module.exports = { authenticateAdmin };