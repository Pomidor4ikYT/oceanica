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

  try {
    const user = jwt.verify(token, SECRET_KEY);
    console.log('🔍 Перевірка адміністратора для:', user.email);
    
    let userRole;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL - використовуємо $1
      const result = await query('SELECT role FROM users WHERE email = $1', [user.email]);
      userRole = result.rows?.[0]?.role;
      console.log('📦 PostgreSQL результат:', result.rows);
    } else {
      // SQLite - використовуємо ?
      const result = await query('SELECT role FROM users WHERE email = ?', [user.email]);
      userRole = result?.[0]?.role;
      console.log('📦 SQLite результат:', result);
    }
    
    console.log('👤 Роль в базі:', userRole);
    
    // Перевіряємо чи користувач є адміністратором
    if (userRole !== 'admin') {
      console.log('⛔ Доступ заборонено: не адміністратор');
      return res.status(403).json({ success: false, message: 'Доступ заборонено. Потрібні права адміністратора' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Помилка перевірки токена:', err);
    return res.status(403).json({ success: false, message: 'Недійсний токен' });
  }
}

module.exports = { authenticateAdmin };