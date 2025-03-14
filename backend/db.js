const mysql = require('mysql2/promise');
require('dotenv').config();

// Establish database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create table appointments if not existing
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        notes TEXT
      )
    `);
    console.log('MySQL database is ready.');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  }
})();

module.exports = pool;