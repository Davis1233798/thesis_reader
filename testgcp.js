const mysql = require('mysql');
require('dotenv').config();
// Cloud SQL 連接配置

const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
    database: 'thesis'
});



connection.connect(err => {
    if (err) {
        console.error('連接錯誤：', err);
        return;
    }
    console.log('成功連接到 Cloud SQL');
    // 在這裡編寫您的 SQL 查詢或其他操作
});

// 記得在不再需要時關閉連接
connection.end();
