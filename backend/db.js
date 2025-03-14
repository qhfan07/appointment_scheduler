const mysql = require('mysql2/promise');

// Establish database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '7474974aA.',
  database: 'appointments_db',
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
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        date DATE,
        time TIME,
        notes TEXT
      )
    `);
    console.log('MySQL database is ready.');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  }
})();

module.exports = pool;