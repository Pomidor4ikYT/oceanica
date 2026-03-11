// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/constants');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Токен відсутній' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Недійсний токен' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };