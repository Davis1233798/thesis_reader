// const mysql = require('mysql');
// require('dotenv').config();
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: 'thesis',
    charset: 'utf8mb4',
});


connection.connect(err => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }

    console.log('数据库已连接，连接ID为 ' + connection.threadId);
});



