const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
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



function extractDomain(url) {
    if (!url || typeof url !== 'string') {
        console.error('Invalid url:', url);
        return '';
    }
    console.log('extractDomain-url:', url);
    const domain = url.replace(/(https?:\/\/)?(www\.)?/, '');
    return domain.split('/')[0].split('.')[0];
}

function containsDomain(str, start, end, url) {
    const subStr = str.substring(start, end);
    const domain = extractDomain(url);
    return subStr.includes(domain);
}




connection.query('SELECT url FROM url', (err, rows, fields) => {
    if (err) throw err;
    for (let i = 0; i < rows.length; i++) {
        // 假設我們想檢查整個 url 字段，並將其與自己進行比較
        console.log(containsDomain(rows[i].url, 0, rows[i].url.length, rows[i].url));
    }
});


connection.end();
