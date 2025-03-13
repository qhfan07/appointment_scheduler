const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 解析 JSON 请求体
app.use(express.json());

// 连接到 SQLite 数据库
const db = new sqlite3.Database('./appointments.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Successfully connected to database.');
  }
});

// 创建约会表（如果表不存在）
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  date TEXT,
  time TEXT,
  notes TEXT
)`);

// 示例 API 端点：获取所有约会
app.get('/appointments', (req, res) => {
  db.all('SELECT * FROM appointments', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});