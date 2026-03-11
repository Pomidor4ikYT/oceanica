// server/config/constants.js
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.JWT_SECRET || 'your-secret-key-change-this',
  USE_POSTGRES: process.env.DATABASE_URL ? true : false,
  DB_PATH: path.join(__dirname, '../../server/oceanica.db'),
  JWT_EXPIRES_IN: '7d'
};