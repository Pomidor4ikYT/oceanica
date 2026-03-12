// server/controllers/adminController.js
const { query } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

const validTypes = ['tour', 'cruise', 'island', 'hot'];

async function getItems(req, res) {
  const { type } = req.params;
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }
  
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      result = await query(
        'SELECT * FROM tours WHERE type = $1 ORDER BY id DESC',
        [type]
      );
    } else {
      // SQLite
      result = await query(
        'SELECT * FROM tours WHERE type = ? ORDER BY id DESC',
        [type]
      );
    }
    
    const items = (process.env.NODE_ENV === 'production' ? result.rows : result).map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departureDates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    
    res.json({ success: true, items });
  } catch (error) {
    console.error('❌ Помилка отримання:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function addItem(req, res) {
  const { type } = req.params;
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }

  const {
    title, description, price, duration, groupSize,
    accommodation, badge, category, image, departureDates, chips, meta
  } = req.body;

  if (!title || !price) {
    return res.status(400).json({ success: false, message: 'Назва та ціна обов\'язкові' });
  }

  try {
    const priceWithCurrency = price.toString().includes('грн') ? price : price + ' грн';
    
    const formattedDuration = duration && !isNaN(duration) 
      ? duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів') 
      : duration;
    const formattedGroup = groupSize && !isNaN(groupSize) ? groupSize + ' осіб' : groupSize;
    const formattedAccom = accommodation && !isNaN(accommodation) 
      ? 'Готель ' + accommodation + '*' 
      : accommodation;
    
    let result;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      result = await query(
        `INSERT INTO tours (
          type, title, description, price, duration, groupSize, 
          accommodation, badge, category, image, departureDates, chips, meta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          type, title, description || '', priceWithCurrency, formattedDuration || '', 
          formattedGroup || '', formattedAccom || '', badge || '', category || '',
          image || '', JSON.stringify(departureDates || []), JSON.stringify(chips || []), meta || ''
        ]
      );
      const newItem = result.rows[0];
      res.json({ success: true, item: newItem });
    } else {
      // SQLite
      result = await query(
        `INSERT INTO tours (
          type, title, description, price, duration, groupSize, 
          accommodation, badge, category, image, departureDates, chips, meta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type, title, description || '', priceWithCurrency, formattedDuration || '', 
          formattedGroup || '', formattedAccom || '', badge || '', category || '',
          image || '', JSON.stringify(departureDates || []), JSON.stringify(chips || []), meta || ''
        ]
      );
      // Для SQLite потрібно отримати ID
      const newItem = await query('SELECT * FROM tours WHERE id = ?', [result.lastID]);
      res.json({ success: true, item: newItem[0] });
    }
  } catch (error) {
    console.error('❌ Помилка додавання:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера: ' + error.message });
  }
}

async function updateItem(req, res) {
  const { type, id } = req.params;
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }

  const {
    title, description, price, duration, groupSize,
    accommodation, badge, category, image, departureDates, chips, meta
  } = req.body;

  try {
    let updates = [];
    let values = [];
    let paramIndex = 1;

    const addUpdate = (field, value) => {
      if (process.env.NODE_ENV === 'production') {
        updates.push(`${field} = $${paramIndex++}`);
      } else {
        updates.push(`${field} = ?`);
      }
      values.push(value);
    };

    if (title !== undefined) addUpdate('title', title);
    if (description !== undefined) addUpdate('description', description);
    if (price !== undefined) { 
      const priceWithCurrency = price.toString().includes('грн') ? price : price + ' грн';
      addUpdate('price', priceWithCurrency); 
    }
    if (duration !== undefined) { 
      const formattedDuration = duration && !isNaN(duration) 
        ? duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів') 
        : duration;
      addUpdate('duration', formattedDuration); 
    }
    if (groupSize !== undefined) { 
      const formattedGroup = groupSize && !isNaN(groupSize) ? groupSize + ' осіб' : groupSize;
      addUpdate('groupSize', formattedGroup); 
    }
    if (accommodation !== undefined) { 
      const formattedAccom = accommodation && !isNaN(accommodation) ? 'Готель ' + accommodation + '*' : accommodation;
      addUpdate('accommodation', formattedAccom); 
    }
    if (badge !== undefined) addUpdate('badge', badge);
    if (category !== undefined) addUpdate('category', category);
    if (image !== undefined) addUpdate('image', image);
    if (departureDates !== undefined) addUpdate('departureDates', JSON.stringify(departureDates));
    if (chips !== undefined) addUpdate('chips', JSON.stringify(chips));
    if (meta !== undefined) addUpdate('meta', meta);

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    // Додаємо умови WHERE
    if (process.env.NODE_ENV === 'production') {
      values.push(id, type);
      const queryStr = `UPDATE tours SET ${updates.join(', ')} WHERE id = $${paramIndex} AND type = $${paramIndex + 1} RETURNING *`;
      const result = await query(queryStr, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Тур не знайдено' });
      }
      
      res.json({ success: true, item: result.rows[0] });
    } else {
      values.push(id, type);
      const queryStr = `UPDATE tours SET ${updates.join(', ')} WHERE id = ? AND type = ?`;
      await query(queryStr, values);
      
      const updatedItem = await query('SELECT * FROM tours WHERE id = ?', [id]);
      if (updatedItem.length === 0) {
        return res.status(404).json({ success: false, message: 'Тур не знайдено' });
      }
      
      res.json({ success: true, item: updatedItem[0] });
    }
  } catch (error) {
    console.error('❌ Помилка оновлення:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function deleteItem(req, res) {
  const { type, id } = req.params;
  
  try {
    if (process.env.NODE_ENV === 'production') {
      const result = await query(
        'DELETE FROM tours WHERE id = $1 AND type = $2 RETURNING *',
        [id, type]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Тур не знайдено' });
      }
    } else {
      const result = await query(
        'DELETE FROM tours WHERE id = ? AND type = ?',
        [id, type]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Тур не знайдено' });
      }
    }
    
    res.json({ success: true, message: 'Тур видалено' });
  } catch (error) {
    console.error('❌ Помилка видалення:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getUsers(req, res) {
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await query(
        'SELECT id, name, email, phone, registered, role FROM users ORDER BY id DESC'
      );
    } else {
      result = await query(
        'SELECT id, name, email, phone, registered, role FROM users ORDER BY id DESC'
      );
    }
    
    const users = process.env.NODE_ENV === 'production' ? result.rows : result;
    res.json({ success: true, users });
  } catch (error) {
    console.error('❌ Помилка отримання користувачів:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Невірна роль' });
  }
  
  try {
    if (process.env.NODE_ENV === 'production') {
      await query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    } else {
      await query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }
    
    res.json({ success: true, message: 'Роль оновлено' });
  } catch (error) {
    console.error('❌ Помилка оновлення ролі:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getAllBookings(req, res) {
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await query(
        `SELECT b.*, u.name as user_name, u.email as user_email 
         FROM bookings b 
         JOIN users u ON b.user_email = u.email 
         ORDER BY b.id DESC`
      );
    } else {
      result = await query(
        `SELECT b.*, u.name as user_name, u.email as user_email 
         FROM bookings b 
         JOIN users u ON b.user_email = u.email 
         ORDER BY b.id DESC`
      );
    }
    
    const bookings = (process.env.NODE_ENV === 'production' ? result.rows : result).map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('❌ Помилка отримання бронювань:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

module.exports = {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getUsers,
  updateUserRole,
  getAllBookings
};