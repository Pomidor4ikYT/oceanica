// server/routes/api.js
const express = require('express');
const router = express.Router();
const { query } = require('../database/db');
const { safeJsonParse } = require('../utils/helpers');

async function getItems(req, res, type) {
  try {
    const result = await query("SELECT * FROM tours WHERE type = ? ORDER BY id DESC", [type]);
    const items = result.rows.map(row => ({
      ...row,
      departureDates: safeJsonParse(row.departureDates, []),
      chips: safeJsonParse(row.chips, [])
    }));
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

router.get('/tours', (req, res) => getItems(req, res, 'tour'));
router.get('/cruises', (req, res) => getItems(req, res, 'cruise'));
router.get('/islands', (req, res) => getItems(req, res, 'island'));
router.get('/hot', (req, res) => getItems(req, res, 'hot'));

module.exports = router;