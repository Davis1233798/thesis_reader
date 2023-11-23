// 引入必要的模組
import express from 'express';
import { createConnection } from 'mysql';

// 建立一個新的 express 應用
const app = express();

// 設定 MySQL 連線
const connection = createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'thesis'
});

// 建立資料庫連線
connection.connect();

// 設定一個簡單的路由來獲取資料
app.get('/data', (req, res) => {
    connection.query('SELECT * FROM thesis', (error, results, fields) => {
        console.log('results:', results);
        if (error) throw error;
        res.json(results);
    });
});

// 設定伺服器監聽的端口
app.listen(3002, () => {
    console.log('Server is running on port 3000');
});
