const express = require('express');
const router = express.Router();
const db = require('../db');

// Get appointments with optional pagination
router.get('/', (req, res) => {
  const NUMBER_PER_PAGE = 5;
  // Check if page parameter is provided
  const pageParam = req.query.page;
  const limitParam = req.query.limit;

  // if not, return all appointments
  if (!pageParam && !limitParam) {
    db.all('SELECT * FROM appointments ORDER BY date, time', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
    return;
  }

  // if provided, return by pages
  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || NUMBER_PER_PAGE;
  const offset = (page - 1) * limit;

  const countSql = 'SELECT COUNT(*) AS count FROM appointments';
  const dataSql = 'SELECT * FROM appointments ORDER BY date, time LIMIT ? OFFSET ?';

  // Count total number
  db.get(countSql, [], (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const total = countResult.count;
    // Query data for the current page
    db.all(dataSql, [limit, offset], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ total, page, limit, data: rows });
    });
  });
});

// Create a new appointment
router.post('/', (req, res) => {
  const { name, email, phone, date, time, notes } = req.body;
  db.run(
      'INSERT INTO appointments (name, email, phone, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, date, time, notes],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      }
  );
});

// Search for appointments
router.get('/search', (req, res) => {
  const searchTerm = req.query.term ? `%${req.query.term}%` : '%';
  const sql = `SELECT * FROM appointments WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR date LIKE ? OR time LIKE ? OR notes LIKE ?`;
  db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;