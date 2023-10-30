const mysql = require('mysql2');

// 创建数据库连接
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nodejs'
});

// 尝试连接数据库
connection.connect(function (err) {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }

    console.log('已成功连接到数据库，连接 ID: ' + connection.threadId);
    // 关闭连接
    connection.end();
});
