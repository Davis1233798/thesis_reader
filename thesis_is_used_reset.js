const mysql = require('mysql2');
require('dotenv').config();
// Cloud SQL 連接配置

const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
    database: 'thesis',
    charset: 'utf8mb4'
});

// 连接数据库
connection.connect(err => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }

    console.log('数据库连接成功.');
});

// 更新 `thesis` 表中的 `is_used` 字段
connection.query('UPDATE `thesis` SET `is_used` = 0', (error, results, fields) => {
    if (error) {
        console.error('执行更新操作时出错: ' + error.stack);
        connection.end();
        return;
    }

    console.log('更新操作成功完成，影响的行数：', results.affectedRows);
    connection.end();
});
connection.end();
