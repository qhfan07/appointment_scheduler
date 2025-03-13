const sqlite3 = require('sqlite3').verbose();

// Establish database connection
const db = new sqlite3.Database('./appointments.db', (err) => {
  if (err) {
    console.error('Fail to connect to database:', err.message);
  } else {
    console.log('Successfully connected to database.');
  }
});

// Create appointments table(if does not exist)
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  date TEXT,
  time TEXT,
  notes TEXT
)`);

module.exports = db;