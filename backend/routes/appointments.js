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