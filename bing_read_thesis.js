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

connection.connect();

function checkAndReplace(prompt) {
    return prompt.includes('abs') ? prompt.replace('abs', 'pdf') : prompt;
}

function extractDomain(url) {
    if (!url || typeof url !== 'string') {
        console.error('Invalid url:', url);
        return '';
    }

    console.log('extractDomain-url:', url);

    // Using a regular expression to match domain pattern
    const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/);

    if (match) {
        return match[1];
    }

    return '';
}

function containsArxiv(response, start, end, url) {
    const str = response.data;
    console.log('url before !:', url);
    if (!url) {
        console.error('Invalid url:', url);
        return false;
    }
    end > 0 ? end = end : end = start + 100;
    const subStr = str.substring(start, end);
    const domain = extractDomain(url);
    console.log('url:', url);
    console.log('str:', str);
    console.log('start:', start);
    console.log('end:', end);
    console.log('subStr:', subStr);
    console.log('domain:', domain);
    console.log('subStr:', subStr.includes(domain));
    return subStr.includes(domain);
}

function containsProhibitedText(data) {
    return data.includes('很抱歉');
}

async function sendRequest(prompt) {
    try {
        const modifiedPrompt = checkAndReplace(prompt);
        console.log('URL for request:', modifiedPrompt);
        const response = await axios.get(`http://127.0.0.1:5500`, {
            params: {
                text: `你是一個學術專家 閱讀 ${modifiedPrompt} 用key=>value的方式呈現以下資訊 1.文獻名稱2.APA7引用格式3.文獻連結4.這篇文獻的研究方法,5.這篇文獻對提示詞的量化方法6.這篇文獻對提示詞生成結果的量化方法7.這篇文獻的實驗步驟8.這篇文獻的研究成果 文獻連結必須詳細`
            }
        });


        console.log('Response received:', response.data);
        const startIndex = response.data.indexOf('文獻連結');
        const endIndex = response.data.indexOf('研究方法');
        if ((startIndex !== -1 && endIndex !== -1 && !containsArxiv(response, startIndex, endIndex, modifiedPrompt)) || containsProhibitedText(response.data)) {
            console.log('Re-sending request due to missing arxiv or prohibited text...');
            return await sendRequest(prompt);
        } else {
            console.log('Request accepted!'.prompt);
        }

        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}

function saveToDatabase(data, url, id, prompt) {
    const jsonData = JSON.stringify(data);
    const jsonPrompt = JSON.stringify(prompt);
    if (url !== undefined) {
        const insertQuery = `INSERT INTO thesis (response, url_id, prompt) VALUES (?, ?, ?)`;
        connection.query(insertQuery, [jsonData, id, jsonPrompt], (error, results) => {
            if (error) throw error;
            console.log('Data saved to thesis:', results.insertId);
        });

        console.log(url);
        const updateQuery = `UPDATE url SET is_used = 1 WHERE id=${id}`;
        connection.query(updateQuery, (error, results) => {
            if (error) throw error;
            console.log(`URL updated: ${url}`);
        });
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
                await saveToDatabase(data, row.url, row.id, row.prompt);
            }
        }
    }

    connection.end();
}

main();
