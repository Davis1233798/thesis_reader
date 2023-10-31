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

// 連接數據庫
connection.connect();

function checkAndReplace(prompt) {
    return prompt.includes('abs') ? prompt.replace('abs', 'pdf') : prompt;
}
function checkAndReplace2(prompt) {
    return prompt.includes('pdf') ? prompt.replace('pdf', 'abs') : prompt;
}

function extractDomain(url) {
    // 移除協議（如 http://, https://）和 'www'
    const domain = url.replace(/(https?:\/\/)?(www\.)?/, '');

    // 從 URL 中取得主域名部分（在第一個 '/' 之前的部分）
    return domain.split('/')[0].split('.')[0];
}

function containsArxiv(str, start, end, url) {
    const subStr = str.substring(start, end);
    const domain = extractDomain(url);
    return subStr.includes(domain);
}

function containsProhibitedText(data) {
    return data.includes('很抱歉，我無法直接閱讀或提供特定網站上的內容');
}

async function sendRequest(prompt) {
    try {
        const modifiedPrompt = checkAndReplace(prompt);
        const query = 'UPDATE url SET is_taken=1 WHERE url = ?';
        console.log('modifiedPrompt:', modifiedPrompt);
        const response = await axios.get(`http://127.0.0.1:5500`, {
            params: {
                text: `你是一個學術專家 閱讀 ${modifiedPrompt} 用key=>value的方式呈現以下資訊 1.文獻名稱2.APA7引用格式3.文獻連結4.這篇文獻的研究方法,5.這篇文獻何對提示詞的量化方法6.這篇文獻的實驗步驟7.這篇文獻的研究成果`
            }
        });

        console.log('Response received:', response.data);
        const startIndex = response.data.indexOf('文獻連結');
        const endIndex = response.data.indexOf('研究方法');
        if ((startIndex !== -1 && endIndex !== -1 && !containsArxiv(response.data, startIndex, endIndex)) || containsProhibitedText(response.data)) {
            console.log('Re-sending request due to missing arxiv or prohibited text...');
            return await sendRequest(prompt);
        }

        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}

function extractUrl(data) {
    const urlMatch = data.match(/文獻連結: (https?:\/\/[^\s]+)/);
    return urlMatch ? urlMatch[1] : null;
}

async function updateUrlUsage(url) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE url SET is_used = 1 WHERE url = ?';
        connection.query(query, [url], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}

function saveToDatabase(data, url, id, prompt) {
    const jsonData = JSON.stringify(data);
    const jsonPrompt = JSON.stringify(prompt);
    if (url !== undefined) {

        // 存入 thesis 表，包含 id
        const insertQuery = `INSERT INTO thesis (response, url_id,prompt) VALUES (?, ?,?)`;
        connection.query(insertQuery, [jsonData, id, jsonPrompt], (error, results) => {
            if (error) throw error;
            console.log('Data saved to thesis:', results.insertId);
        });
        // 更新 url 表
        console.log(url);
        const updateQuery = `UPDATE url SET is_used = 1 WHERE id=${id}`;
        connection.query(updateQuery, [url], (error, results) => {
            if (error) throw error;
            console.log(`URL updated: ${url}`);
        });
    } else {

    }
}

async function main() {
    let continueProcessing = true;

    while (continueProcessing) {
        const query = 'SELECT id, url FROM url WHERE is_taken=0 ORDER BY id ASC LIMIT 1';

        const results = await new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });

        if (results.length === 0) {
            continueProcessing = false;
        } else {
            const row = results[0];
            // 更新 is_taken
            await new Promise((resolve, reject) => {
                const updateQuery = `UPDATE url SET is_taken=1 WHERE id = ${row.id}`;
                connection.query(updateQuery, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            const data = await sendRequest(row.url);
            if (data) {
                await saveToDatabase(data, row.url, row.id);
            }

        }
    }

    // 關閉數據庫連接
    connection.end();
}

main();
