// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const { SECRET_KEY, JWT_EXPIRES_IN } = require('../config/constants');

async function register(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Заповніть всі обов\'язкові поля' });
  }

  try {
    // Перевірка чи існує користувач
    let existingUser;
    if (process.env.NODE_ENV === 'production') {
      const result = await query('SELECT email FROM users WHERE email = $1', [email]);
      existingUser = result.rows[0];
    } else {
      const result = await query('SELECT email FROM users WHERE email = ?', [email]);
      existingUser = result[0];
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const registered = new Date().toLocaleDateString('uk-UA');

    // Створення користувача
    let newUser;
    if (process.env.NODE_ENV === 'production') {
      const result = await query(
        'INSERT INTO users (name, email, phone, password, registered, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING name, email, phone, registered, role',
        [name, email, phone || '', hashedPassword, registered, 'user']
      );
      newUser = result.rows[0];
    } else {
      const result = await query(
        'INSERT INTO users (name, email, phone, password, registered, role) VALUES (?, ?, ?, ?, ?, ?) RETURNING name, email, phone, registered, role',
        [name, email, phone || '', hashedPassword, registered, 'user']
      );
      newUser = result[0];
    }

    const token = jwt.sign(
      { email: newUser.email, name: newUser.name, role: newUser.role },
      SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        registered: newUser.registered,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Введіть email та пароль' });
  }

  try {
    // Пошук користувача
    let user;
    if (process.env.NODE_ENV === 'production') {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    } else {
      const result = await query('SELECT * FROM users WHERE email = ?', [email]);
      user = result[0];
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Невірний email або пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Невірний email або пароль' });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

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
    console.error('Помилка входу:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getUserData(req, res) {
  try {
    // Отримання даних користувача
    let user;
    if (process.env.NODE_ENV === 'production') {
      const result = await query(
        'SELECT name, email, phone, registered, bio, role FROM users WHERE email = $1',
        [req.user.email]
      );
      user = result.rows[0];
    } else {
      const result = await query(
        'SELECT name, email, phone, registered, bio, role FROM users WHERE email = ?',
        [req.user.email]
      );
      user = result[0];
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Помилка отримання даних:', error);
    res.status(500).json({ success: false, message: 'Помилка бази даних' });
  }
}

async function updateUser(req, res) {
  const { name, email, phone, bio, password } = req.body;
  const userEmail = req.user.email;

  try {
    // Перевірка email якщо змінюється
    if (email && email !== userEmail) {
      let existing;
      if (process.env.NODE_ENV === 'production') {
        const result = await query('SELECT email FROM users WHERE email = $1', [email]);
        existing = result.rows[0];
      } else {
        const result = await query('SELECT email FROM users WHERE email = ?', [email]);
        existing = result[0];
      }
      
      if (existing) {
        return res.status(400).json({ success: false, message: 'Цей email вже використовується' });
      }
    }

    let updates = [];
    let values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(bio);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    values.push(userEmail);
    
    let updatedUser;
    if (process.env.NODE_ENV === 'production') {
      const result = await query(
        `UPDATE users SET ${updates.join(', ')} WHERE email = $${paramIndex} RETURNING name, email, phone, bio`,
        values
      );
      updatedUser = result.rows[0];
    } else {
      // Для SQLite потрібно переробити RETURNING
      await query(
        `UPDATE users SET ${updates.join(', ').replace(/\$/g, '?')} WHERE email = ?`,
        values
      );
      const result = await query('SELECT name, email, phone, bio FROM users WHERE email = ?', [email || userEmail]);
      updatedUser = result[0];
    }

    let token = null;
    if (email && email !== userEmail) {
      token = jwt.sign(
        { email: updatedUser.email, name: updatedUser.name, role: updatedUser.role },
        SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN }
      );
    }

    res.json({
      success: true,
      user: updatedUser,
      token
    });
  } catch (error) {
    console.error('Помилка оновлення:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function deleteUser(req, res) {
  try {
    if (process.env.NODE_ENV === 'production') {
      await query('DELETE FROM users WHERE email = $1', [req.user.email]);
    } else {
      await query('DELETE FROM users WHERE email = ?', [req.user.email]);
    }
    
    res.json({ success: true, message: 'Акаунт видалено' });
  } catch (error) {
    console.error('Помилка видалення:', error);
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