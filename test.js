const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nodejs'
});

connection.connect(err => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }

    console.log('数据库已连接，连接ID为 ' + connection.threadId);
});

connection.query('SELECT * FROM thesis', (err, rows, fields) => {
    if (err) throw err;

    console.log('数据: ', rows);
});


connection.end();
