const express = require('express');
const pool = require('../db');
const BaseController = require('./BaseController');

class AppointmentController extends BaseController {
  constructor() {
    super();
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Bind all routes to the router
  initializeRoutes() {
    this.router.get('/', this.getAll.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/search', this.search.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  // GET /appointments
  async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      // If no pagination parameters are provided, return all data
      if (!page && !limit) {
        const [rows] = await pool.query(`
          SELECT id, name, email, phone,
          DATE_FORMAT(date, '%Y-%m-%d') AS date,
          TIME_FORMAT(time, '%H:%i') AS time, notes 
          FROM appointments ORDER BY date, time
        `);
        return this.sendResponse(res, rows);
      }

      // Paginated query
      const p = parseInt(page) || 1;
      const l = parseInt(limit) || 5;
      const offset = (p - 1) * l;
      const [countResult] = await pool.query('SELECT COUNT(*) AS count FROM appointments');
      const total = countResult[0].count;
      const [rows] = await pool.query(`
        SELECT id, name, email, phone,
        DATE_FORMAT(date, '%Y-%m-%d') AS date,
        TIME_FORMAT(time, '%H:%i') AS time, notes 
        FROM appointments ORDER BY date, time LIMIT ? OFFSET ?
      `, [l, offset]);
      this.sendResponse(res, { total, page: p, limit: l, data: rows });
    } catch (err) {
      this.sendError(res, err);
    }
  }

  // POST /appointments
  async create(req, res) {
    try {
      const { name, email, phone, date, time, notes } = req.body;
      const [result] = await pool.query(
          'INSERT INTO appointments (name, email, phone, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, phone, date, time, notes]
      );
      this.sendResponse(res, { id: result.insertId });
    } catch (err) {
      this.sendError(res, err);
    }
  }

  // GET /appointments/search?term=xxx
  async search(req, res) {
    try {
      const searchTerm = req.query.term ? `%${req.query.term}%` : '%';
      const [rows] = await pool.query(`
        SELECT id, name, email, phone,
        DATE_FORMAT(date, '%Y-%m-%d') AS date,
        TIME_FORMAT(time, '%H:%i') AS time, notes 
        FROM appointments 
        WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR date LIKE ? OR time LIKE ? OR notes LIKE ?
      `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
      this.sendResponse(res, rows);
    } catch (err) {
      this.sendError(res, err);
    }
  }

  // PUT /appointments/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, date, time, notes } = req.body;
      const [result] = await pool.query(
          'UPDATE appointments SET name = ?, email = ?, phone = ?, date = ?, time = ?, notes = ? WHERE id = ?',
          [name, email, phone, date, time, notes, id]
      );
      this.sendResponse(res, { updated: result.affectedRows });
    } catch (err) {
      this.sendError(res, err);
    }
  }

  // DELETE /appointments/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
      this.sendResponse(res, { deleted: result.affectedRows });
    } catch (err) {
      this.sendError(res, err);
    }
  }
}

module.exports = new AppointmentController().router;
