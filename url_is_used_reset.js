const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();
// Cloud SQL 連接配置

const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
    database: 'thesis',
    charset: 'utf8mb4'
});
// 連接數據庫
connection.connect();

const query = `UPDATE url SET is_used=0`;

connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log('Data saved:', results.insertId);
});