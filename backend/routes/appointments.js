const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, param, validationResult} = require('express-validator');

// Get appointments with optional pagination
router.get('/', async (req, res) => {
  const NUMBER_PER_PAGE = 5;
  // Check if page parameter is provided
  const pageParam = req.query.page;
  const limitParam = req.query.limit;

  // if not, return all appointments
  if (!pageParam && !limitParam) {
    try {
      // Change data format
      const [rows] = await pool.query(`
          SELECT id, name, email, phone, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, TIME_FORMAT(time, \'%H:%i\') AS time, notes 
          FROM appointments ORDER BY date, time
          `);
      return res.json(rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // if provided, return by pages
  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || NUMBER_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const [countResult] = await pool.query('SELECT COUNT(*) AS count FROM appointments');
    const total = countResult[0].count;
    // Change data format
    const sqlQuery = `
         SELECT id, name, email, phone, DATE_FORMAT(date, '%Y-%m-%d') AS date, TIME_FORMAT(time, '%H:%i') AS time, notes 
         FROM appointments ORDER BY date, time LIMIT ? OFFSET ?
         `;
    const [rows] = await pool.query(sqlQuery, [limit, offset]);
    res.json({ total, page, limit, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new appointment
router.post('/',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Phone must be in 123-456-7890 format'),
    body('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
    body('time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Time must be in HH:MM format'),
  ],
  async (req, res) => {
    const { name, email, phone, date, time, notes } = req.body;
    try {
      const [result] = await pool.query(
          'INSERT INTO appointments (name, email, phone, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, phone, date, time, notes]
      );
      res.json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Search for appointments
router.get('/search', async (req, res) => {
  const searchTerm = req.query.term ? `%${req.query.term}%` : '%';
  const sql = `
    SELECT id, name, email, phone, DATE_FORMAT(date, '%Y-%m-%d') AS date, TIME_FORMAT(time, '%H:%i') AS time, notes FROM appointments 
    WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR date LIKE ? OR time LIKE ? OR notes LIKE ?
  `;
  try {
    const [rows] = await pool.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing appointment
router.put('/:id',
  [
    param('id').isInt().withMessage('Appointment ID must be an integer'),
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Phone must be in 123-456-7890 format'),
    body('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
    body('time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Time must be in HH:MM format'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, date, time, notes } = req.body;
    const id = req.params.id;
    try {
      const [result] = await pool.query(
        'UPDATE appointments SET name = ?, email = ?, phone = ?, date = ?, time = ?, notes = ? WHERE id = ?',
        [name, email, phone, date, time, notes, id]
      );
      res.json({ updated: result.affectedRows });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;