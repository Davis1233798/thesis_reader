// const axios = require('axios');
// const mysql = require('mysql');
// require('dotenv').config();
import axios from 'axios';
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.GCP_HOST);
const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
    database: 'thesis',
    charset: 'utf8mb4'
});

async function main() {
    await new Promise((resolve, reject) => {
        const updateQuery = `UPDATE url SET is_taken=0 WHERE is_used=0`;
        connection.query(updateQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
main();