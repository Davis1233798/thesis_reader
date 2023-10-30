// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

// 数据库连接配置
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nodejs',
    charset: 'utf8mb4'
});


// API 获取 thesis 数据
app.get('/thesis', (req, res) => {
    db.query('SELECT * FROM thesis', (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
