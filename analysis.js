require('dotenv').config();
const mariadb = require('mariadb');

// 数据库连接配置
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

// 关键词列表和正则表达式
const keys = [
    '文獻名稱[:：]',
    'APA7 ?引用格式[:：]',
    '文獻連結[:：]',
    '這篇文獻的研究方法[:：]',
    '這篇文獻何對提示詞的量化方法[:：]',
    '這篇文獻的實驗步驟[:：]',
    '這篇文獻的研究成果[:：]'
];

// 提取数据的函数
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

// 数据库查询和更新
async function processThesis() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT id, response FROM thesis WHERE is_used = 0');

        for (let row of rows) {
            let data = {};
            keys.forEach((key, index) => {
                const keyRegex = new RegExp(key);
                const nextKeyRegex = index < keys.length - 1 ? new RegExp(keys.slice(index + 1).join('|')) : null;
                data[key] = extractData(row.response, keyRegex, nextKeyRegex);
            });

            // 清理数据
            for (let key in data) {
                data[key] = data[key]
                    .replace(/\\n-/g, ' ') // 去除换行符
                    .replace(/\\n/g, ' ') // 去除换行符
                    .replace(/["\\'\n]/g, '')
                    .replace(/\*\*(.*?)\*\*/g, '$1') // 去除粗体
                    .replace(/\[\^\d+\^\]|\[\d+\]|\d+\./g, ''); // 去除引用标记

            }

            // 更新数据库
            await conn.query('UPDATE thesis SET is_used = 1, t_name = ?, apa = ?, url = ?, method = ?, t_method = ?, research_step = ?, research_final = ? WHERE id = ?', [
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
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
}

processThesis();