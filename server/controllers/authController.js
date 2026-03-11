// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get } = require('../database/db');
const { SECRET_KEY, JWT_EXPIRES_IN } = require('../config/constants');

async function register(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Заповніть всі обов\'язкові поля' });
  }

  try {
    const existingUser = await get('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const registered = new Date().toLocaleDateString('uk-UA');

    await run(
      'INSERT INTO users (name, email, phone, password, registered, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || '', hashedPassword, registered, 'user']
    );

    const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    res.json({
      success: true,
      token,
      user: { name, email, phone: phone || '', registered, role: 'user' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Введіть email та пароль' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Невірний email або пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Невірний email або пароль' });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        registered: user.registered,
        bio: user.bio || '',
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getUserData(req, res) {
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

async function updateUser(req, res) {
  const { name, email, phone, bio, password } = req.body;
  const userEmail = req.user.email;

  try {
    if (email && email !== userEmail) {
      const existing = await get('SELECT email FROM users WHERE email = ?', [email]);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Цей email вже використовується' });
      }
    }

    let updates = [];
    let values = [];

    if (name) { updates.push(`name = ?`); values.push(name); }
    if (email) { updates.push(`email = ?`); values.push(email); }
    if (phone !== undefined) { updates.push(`phone = ?`); values.push(phone); }
    if (bio !== undefined) { updates.push(`bio = ?`); values.push(bio); }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = ?`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    values.push(userEmail);
    const queryStr = `UPDATE users SET ${updates.join(', ')} WHERE email = ? RETURNING name, email, phone, bio`;
    
    const result = await query(queryStr, values);
    const updatedUser = result.rows[0];

    let token = null;
    if (email && email !== userEmail) {
      token = jwt.sign({ email: updatedUser.email, name: updatedUser.name }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    }

    res.json({
      success: true,
      user: updatedUser,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function deleteUser(req, res) {
  try {
    await run('DELETE FROM users WHERE email = ?', [req.user.email]);
    res.json({ success: true, message: 'Акаунт видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка видалення акаунта' });
  }
}

module.exports = {
  register,
  login,
  getUserData,
  updateUser,
  deleteUser
};