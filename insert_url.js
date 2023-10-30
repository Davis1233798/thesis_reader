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


// 連接資料庫
connection.connect(err => {
    if (err) {
        console.error('資料庫連接失敗: ' + err.stack);
        return;
    }

    console.log('已連接至資料庫，ID: ' + connection.threadId);
});

// 假設你有一個一維陣列，例如
const dataArray = ["https://arxiv.org/abs/2303.14725", " https://arxiv.org/abs/2302.07842", " https://arxiv.org/abs/2301.00234", " https://arxiv.org/abs/2212.10403", " https://arxiv.org/abs/2212.09597", " https://arxiv.org/abs/2206.07682", " https://arxiv.org/abs/2204.13988", " https://arxiv.org/abs/2107.13586", " https://arxiv.org/abs/2303.17651v1", " https://arxiv.org/abs/2303.13824", " https://arxiv.org/abs/2303.13283", " https://arxiv.org/abs/2303.13217", " https://arxiv.org/abs/2303.11315", " https://arxiv.org/abs/2303.10475", " https://arxiv.org/abs/2303.08518", " https://arxiv.org/abs/2303.07320", " https://arxiv.org/abs/2303.03922", " https://arxiv.org/abs/2303.03628", " https://arxiv.org/abs/2303.03846", " https://arxiv.org/abs/2303.02913", " https://arxiv.org/abs/2303.02909", " https://arxiv.org/abs/2303.02861", " https://arxiv.org/abs/2303.02577", " https://arxiv.org/abs/2303.01580", " https://arxiv.org/abs/2303.02151", " https://arxiv.org/abs/2303.00293", " https://arxiv.org/pdf/2302.10198.pdf", " https://arxiv.org/abs/2302.14838", " https://arxiv.org/abs/2302.14691", " https://arxiv.org/abs/2302.02676", " https://arxiv.org/abs/2302.14045", " https://arxiv.org/abs/2302.12822", " https://arxiv.org/abs/2302.12246", " https://arxiv.org/abs/2302.12173", " https://arxiv.org/abs/2302.11382", " https://arxiv.org/abs/2302.11520", " https://arxiv.org/abs/2302.11521", " https://arxiv.org/abs/2302.09236", " https://arxiv.org/abs/2302.09185", " https://arxiv.org/abs/2302.07994", " https://arxiv.org/abs/2302.08043", " https://arxiv.org/abs/2302.07459", " https://arxiv.org/abs/2302.06868", " https://arxiv.org/abs/2302.05619", " https://arxiv.org/abs/2302.05698", " https://arxiv.org/abs/2302.03668", " https://arxiv.org/abs/2302.00923", " https://arxiv.org/abs/2302.00093", " https://arxiv.org/abs/2302.00618", " https://arxiv.org/abs/2301.12314", " https://arxiv.org/abs/2301.08721", " https://arxiv.org/abs/2212.14024", " https://arxiv.org/abs/2212.08061", " https://arxiv.org/abs/2212.08073", " https://arxiv.org/abs/2212.04092", " https://arxiv.org/abs/2212.09561v1", " https://arxiv.org/abs/2212.09251", " https://arxiv.org/abs/2212.06713", " https://arxiv.org/abs/2211.10435", " https://arxiv.org/abs/2211.01910", " https://arxiv.org/abs/2211.09527", " https://arxiv.org/abs/2210.07321", " https://arxiv.org/abs/2211.09066", " https://arxiv.org/abs/2211.11875", " https://arxiv.org/abs/2210.01296", " https://arxiv.org/abs/2210.03629", " https://arxiv.org/abs/2210.09150", " https://arxiv.org/abs/2210.02406", " https://arxiv.org/abs/2210.01240v3", " https://arxiv.org/abs/2209.02128", " https://arxiv.org/abs/2209.14610", " https://arxiv.org/abs/2209.11755", " https://arxiv.org/abs/2208.03299", " https://arxiv.org/abs/2207.05987", " https://arxiv.org/abs/2206.02336", " https://arxiv.org/abs/2205.11916", " https://arxiv.org/abs/2205.11822", " https://arxiv.org/abs/2205.00445", " https://arxiv.org/abs/2205.12390", " https://arxiv.org/abs/2205.01543", " https://arxiv.org/abs/2205.03401", " https://arxiv.org/abs/2204.13988", " https://arxiv.org/abs/2203.06566", " https://arxiv.org/abs/2203.11171", " https://arxiv.org/abs/2203.02155", " https://arxiv.org/abs/2202.12837", " https://arxiv.org/abs/2201.11903", " https://arxiv.org/abs/2112.00114", " https://arxiv.org/abs/2110.01691", " https://arxiv.org/abs/2110.08387", " https://arxiv.org/abs/2110.08207", " https://arxiv.org/abs/2109.07830", " https://arxiv.org/abs/2109.06977", " https://arxiv.org/abs/2104.08786", " https://arxiv.org/abs/2104.08691", " https://arxiv.org/abs/2102.07350", " https://arxiv.org/abs/2102.09690", " https://arxiv.org/abs/2101.00190", " https://arxiv.org/abs/2101.00420", " https://arxiv.org/abs/2012.15723", " https://arxiv.org/abs/2010.15980", " https://arxiv.org/abs/2005.14165", " https://arxiv.org/abs/2001.08361", " https://arxiv.org/abs/2303.17564", " https://arxiv.org/abs/2303.17408", " https://arxiv.org/abs/2303.15846", " https://arxiv.org/abs/2303.16434", " https://arxiv.org/abs/2303.16445", " https://arxiv.org/abs/2303.15587", " https://arxiv.org/abs/2303.14375", " https://arxiv.org/abs/2303.15413", " https://arxiv.org/abs/2303.15441#", " https://arxiv.org/abs/2303.13592", " https://arxiv.org/abs/2303.13035", " https://arxiv.org/abs/2303.11455", " https://arxiv.org/abs/2303.09325", " https://arxiv.org/abs/2303.08896", " https://arxiv.org/abs/2303.05063", " https://arxiv.org/abs/2303.05398", " https://arxiv.org/abs/2303.05400", " https://arxiv.org/abs/2303.03199", " https://arxiv.org/abs/2303.01903", " https://arxiv.org/abs/2303.00815", " https://arxiv.org/abs/2303.00733", " https://arxiv.org/abs/2302.14233", " https://arxiv.org/abs/2302.13439", " https://arxiv.org/abs/2302.14169", " https://arxiv.org/abs/2302.12449", " https://arxiv.org/abs/2302.12468", " https://arxiv.org/abs/2302.12692", " https://arxiv.org/abs/2302.12784", " https://arxiv.org/abs/2302.12813", " https://arxiv.org/abs/2302.10916", " https://arxiv.org/abs/2302.08961", " https://arxiv.org/abs/2302.08068", " https://arxiv.org/abs/2302.09236", " https://arxiv.org/abs/2302.08102", " https://arxiv.org/abs/2302.07459", " https://arxiv.org/abs/2302.04156", " https://arxiv.org/abs/2302.03269", " https://arxiv.org/abs/2302.01441", " https://arxiv.org/abs/2301.12810", " https://arxiv.org/abs/2212.02199", " https://arxiv.org/abs/2211.15462", " https://arxiv.org/abs/2209.09513v2", " https://arxiv.org/abs/2210.15157", " https://arxiv.org/abs/2210.14699", " https://arxiv.org/abs/2202.03629"];

// 檢查並插入數據的函數
async function checkAndInsert(item) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM url WHERE url = ?';
        connection.query(query, [item], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                // 如果值不存在，則插入
                const insertQuery = 'INSERT INTO url (url) VALUES (?)';
                connection.query(insertQuery, [item], (insertErr, insertResults) => {
                    if (insertErr) {
                        return reject(insertErr);
                    }
                    resolve(insertResults);
                });
            } else {
                // 如果值已存在，則不進行任何操作
                resolve('已存在，不進行插入');
            }
        });
    });
}

// 遍歷陣列，對每個元素進行檢查和插入
async function processArray(array) {
    for (const item of array) {
        try {
            const result = await checkAndInsert(item);
            console.log('處理結果:', result);
        } catch (error) {
            console.error('處理錯誤:', error);
        }
    }

    // 關閉資料庫連接
    connection.end();
}

// 執行程序
processArray(dataArray);