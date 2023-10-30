const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.GCP_HOST,
    user: process.env.GCP_USER_NAME,
    password: process.env.GCP_PASSWORD,
    database: 'thesis',
    charset: 'utf8mb4'
});

connection.connect();

function checkAndReplace(prompt) {
    return prompt.includes('abs') ? prompt.replace('abs', 'pdf') : prompt;
}

function containsArxiv(str, start, end) {
    const subStr = str.substring(start, end);
    return subStr.includes('arxiv');
}

function containsProhibitedText(data) {
    return data.includes('很抱歉，我無法直接閱讀或提供特定網站上的內容');
}

async function sendRequest(prompt) {
    try {
        const modifiedPrompt = checkAndReplace(prompt);
        const response = await axios.get(`http://127.0.0.1:5500`, {
            params: {
                text: `你是一個學術專家 閱讀 ${modifiedPrompt} 用key => value的方式呈現以下資訊 1.文獻名稱2.APA7引用格式3.文獻連結4.這篇文獻的研究方法, 5.這篇文獻何對提示詞的量化方法6.這篇文獻的實驗步驟7.這篇文獻的研究成果`
            }
        });

        if (containsProhibitedText(response.data)) {
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}

async function updateUrlUsage(id) {
    const query = 'UPDATE url SET is_used = 1 WHERE id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}

function saveToDatabase(data, id) {
    const jsonData = JSON.stringify(data);
    const insertQuery = `INSERT INTO thesis (response) VALUES(?)`;
    connection.query(insertQuery, [jsonData], async (error, results) => {
        if (error) throw error;
        console.log('Data saved to thesis:', results.insertId);

        const updated = await updateUrlUsage(id);
        if (updated) {
            console.log(`URL with ID ${id} updated`);
        } else {
            console.log(`Failed to update URL with ID ${id}`);
        }
    });
}

async function main() {
    try {
        await connection.beginTransaction();

        const selectQuery = 'SELECT id, url FROM url WHERE is_taken=0 LIMIT 1;';
        const [selectResults] = await new Promise((resolve, reject) => {
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });


        if (selectResults.url != null && selectResults.id != 0) {
            const id = selectResults.id;
            const url = selectResults.url;

            const updateQuery = 'UPDATE url SET is_taken=1 WHERE id = ?;';

            await new Promise((resolve, reject) => {
                connection.query(updateQuery, [id], (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            await connection.commit();

            const data = await sendRequest(url);
            if (data) {
                saveToDatabase(data, id);
            }
        } else {
            await connection.commit();
            console.log("沒有更多未處理的 URL。");
        }
    } catch (error) {
        console.error('錯誤發生:', error);
        await connection.rollback();
    } finally {
        connection.end();
    }
}

main();
