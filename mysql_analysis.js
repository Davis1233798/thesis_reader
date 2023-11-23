import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


// 創建 MySQL 連接池
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3307,
    database: 'thesis',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 關鍵詞列表和正則表達式
const keys = [
    '文獻名稱[:：]',
    'APA7 ?引用格式[:：]',
    '文獻連結[:：]',
    '這篇文獻的研究方法[:：]',
    '這篇文獻何對提示詞的量化方法[:：]',
    '這篇文獻的實驗步驟[:：]',
    '這篇文獻的研究成果[:：]'
];

// 提取數據的函數
function extractData(str, keyRegex, nextKeyRegex) {
    const match = keyRegex.exec(str);
    if (!match) return '';
    let startIndex = match.index + match[0].length;
    let subStr = str.slice(startIndex);
    if (nextKeyRegex) {
        const nextKeyMatch = nextKeyRegex.exec(subStr);
        if (nextKeyMatch) {
            subStr = subStr.slice(0, nextKeyMatch.index);
        }
    }
    return subStr.trim();
}

// 資料庫查詢和更新
async function processThesis() {
    try {
        // 從連接池中獲取連接
        const [rows] = await pool.query('SELECT id, response FROM thesis WHERE is_used IS NULL');
        console.log('rows:', rows);
        for (let row of rows) {
            let data = {};
            keys.forEach((key, index) => {
                const keyRegex = new RegExp(key);
                console.log('keyRegex:', keyRegex);
                const nextKeyRegex = index < keys.length - 1 ? new RegExp(keys.slice(index + 1).join('|')) : null;
                data[key] = extractData(row.response, keyRegex, nextKeyRegex);
                console.log('data[key]:', row.response);
                console.log('data[key]:', data[key]);
            });

            // 清理數據
            for (let key in data) {
                data[key] = data[key]
                    .replace(/\\n-/g, ' ') // 去除換行符
                    .replace(/\\n/g, ' ') // 去除換行符
                    .replace(/["\\'\n]/g, '')
                    .replace(/\*\*(.*?)\*\*/g, '$1'); // 去除粗體
                console.log('data[key]:', data[key]);
            }

            // 更新資料庫
            await pool.query('UPDATE thesis SET is_used = 1, t_name = ?, apa = ?, url = ?, method = ?, t_method = ?, research_step = ?, research_final = ? WHERE id = ?', [
                data[keys[0]],
                data[keys[1]],
                data[keys[2]],
                data[keys[3]],
                data[keys[4]],
                data[keys[5]],
                data[keys[6]],
                row.id
            ]);

            console.log(`Processed thesis ID: ${row.id}`);
        }
    } catch (err) {
        console.error(err);
    }
}

processThesis();
