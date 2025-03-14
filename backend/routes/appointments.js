const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all appointments
router.get('/', (req, res) => {
  db.all('SELECT * FROM appointments', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get appointments by pages
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const countSql = 'SELECT COUNT(*) AS count FROM appointments';
  const dataSql = 'SELECT * FROM appointments ORDER BY date, time LIMIT ? OFFSET ?';

  // Get the total number of appointments
  db.get(countSql, [], (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const total = countResult.count;
    // Get data at current page
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