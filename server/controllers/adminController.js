// server/controllers/adminController.js
const { query, run, get } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

const validTypes = ['tour', 'cruise', 'island', 'hot'];

async function getItems(req, res) {
  const { type } = req.params;
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Невірний тип' });
  }
  
  try {
    const result = await query(
      'SELECT * FROM tours WHERE type = ? ORDER BY id DESC',
      [type]
    );
    
    const items = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departureDates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    
    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
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
    
    const result = await run(
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
    
    const newItem = await get('SELECT * FROM tours WHERE id = ?', [result.lastID]);
    res.json({ success: true, item: newItem });
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

    if (title !== undefined) { updates.push(`title = ?`); values.push(title); }
    if (description !== undefined) { updates.push(`description = ?`); values.push(description); }
    if (price !== undefined) { 
      const priceWithCurrency = price.toString().includes('грн') ? price : price + ' грн';
      updates.push(`price = ?`); 
      values.push(priceWithCurrency); 
    }
    if (duration !== undefined) { 
      const formattedDuration = duration && !isNaN(duration) 
        ? duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів') 
        : duration;
      updates.push(`duration = ?`); 
      values.push(formattedDuration); 
    }
    if (groupSize !== undefined) { 
      const formattedGroup = groupSize && !isNaN(groupSize) ? groupSize + ' осіб' : groupSize;
      updates.push(`groupSize = ?`); 
      values.push(formattedGroup); 
    }
    if (accommodation !== undefined) { 
      const formattedAccom = accommodation && !isNaN(accommodation) ? 'Готель ' + accommodation + '*' : accommodation;
      updates.push(`accommodation = ?`); 
      values.push(formattedAccom); 
    }
    if (badge !== undefined) { updates.push(`badge = ?`); values.push(badge); }
    if (category !== undefined) { updates.push(`category = ?`); values.push(category); }
    if (image !== undefined) { updates.push(`image = ?`); values.push(image); }
    if (departureDates !== undefined) { updates.push(`departureDates = ?`); values.push(JSON.stringify(departureDates)); }
    if (chips !== undefined) { updates.push(`chips = ?`); values.push(JSON.stringify(chips)); }
    if (meta !== undefined) { updates.push(`meta = ?`); values.push(meta); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Немає даних для оновлення' });
    }

    values.push(id, type);
    const queryStr = `UPDATE tours SET ${updates.join(', ')} WHERE id = ? AND type = ?`;
    
    const result = await run(queryStr, values);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Тур не знайдено' });
    }
    
    const updatedItem = await get('SELECT * FROM tours WHERE id = ?', [id]);
    res.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function deleteItem(req, res) {
  const { type, id } = req.params;
  
  try {
    const result = await run(
      'DELETE FROM tours WHERE id = ? AND type = ?',
      [id, type]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Тур не знайдено' });
    }
    
    res.json({ success: true, message: 'Тур видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getUsers(req, res) {
  try {
    const result = await query(
      'SELECT id, name, email, phone, registered, role FROM users ORDER BY id DESC'
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error(error);
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
    await run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: 'Роль оновлено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
}

async function getAllBookings(req, res) {
  try {
    const result = await query(
      `SELECT b.*, u.name as user_name, u.email as user_email 
       FROM bookings b 
       JOIN users u ON b.user_email = u.email 
       ORDER BY b.id DESC`
    );
    const bookings = result.rows.map(row => ({
      ...row,
      chips: safeJsonParse(row.chips, [])
    }));
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
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