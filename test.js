// const mysql = require('mysql');
// require('dotenv').config();
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
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

const demo = "[1]: https://arxiv.org/pdf/2303.16445 ""
[2]: https://arxiv.org/abs/2303.16445 ""
[3]: https://www.zhihu.com/question/593547857 ""
[4]: https://doi.org/10.48550/arXiv.2303.16445 ""

你好，這是Bing。我可以幫你分析這篇文獻，並用key => value的方式呈現以下資訊：

- 文獻名稱: Larger Probes Tell a Different Story: Extending Psycholinguistic Datasets Via In - Context Learning
    - APA7引用格式: Shivagunde, N., Lialin, V., & Rumshisky, A. (2023).Larger probes tell a different story: Extending psycholinguistic datasets via in -context learning.arXiv preprint arXiv: 2303.16445.
- 文獻連結: [arXiv](https://arxiv.org/pdf/2303.16445)
        - 這篇文獻的研究方法: 這篇文獻使用了零擊探測（zero - shot probing）的方法，來測試預訓練語言模型（pre - trained language models）對否定（negation）和角色反轉（role reversal）的理解能力。
        - 這篇文獻何對提示詞的量化方法: 這篇文獻使用了掩碼自動編碼器（masked autoencoders）作為提示詞的量化方法，並利用投影模塊（projection module）來對齊兩種模態（point cloud和RGB image）的掩碼和可見標記。
        - 這篇文獻的實驗步驟: 這篇文獻的實驗步驟如下：
        - 使用GPT3生成了兩個新的、更大的數據集，分別是NEG - 1500 - SIMP和ROLE - 1500，分別包含了750對否定句和角色反轉句。
        - 使用模板生成了另一個否定數據集NEG - 1500 - SIMP - TEMP，包含了770對否定句。
        - 在這些數據集上評估了22個預訓練語言模型，包括BERT、ALBERT、GPT3等，並比較了它們的準確率、F1值、AUC值等指標。
        - 分析了不同模型在不同數據集上的表現差異，並探討了可能的原因和影響因素。
        - 這篇文獻的研究成果: 這篇文獻的主要研究成果有以下幾點：
        - 提出了一個新的自監督預訓練框架PiMAE，通過三個方面促進3D和2D交互：掩碼策略、共享解碼器和掩碼token。
        - 發現在更大的數據集上，模型的表現下降了20 - 57 %，顯示出之前的結論可能受到小數據集的限制。
        - 發現BERT和ALBERT等模型在否定數據集上表現出高度的靈敏度，而GPT3等模型則在角色反轉數據集上表現出高度的靈敏度。
        - 發現GPT3雖然生成了所有的ROLE - 1500數據集，但是在探測時只能解決24.6 % 的例子，顯示出生成能力和理解能力之間的差距。";

// function extractDomain(url) {
//     if (!url || typeof url !== 'string') {
//         console.error('Invalid url:', url);
//         return '';
//     }

//     console.log('extractDomain-url:', url);

//     // Using a regular expression to match domain pattern
//     const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/);

//     if (match) {
//         return match[1];
//     }

//     return '';
// }

function containsArxiv(str, start, end, url) {
            console.log('url before !:', url);
            if (!url) {
                console.error('Invalid url:', url);
                return false;
            }
            const subStr = str.substring(start, end);
            const domain = extractDomain(url);
            console.log('url:', url);
            console.log('str:', str);
            console.log('start:', start);
            console.log('end:', end);
            console.log('subStr:', subStr.substring(start, end));
            console.log('domain:', domain);
            console.log('subStr:', subStr.includes(domain));
            return subStr.includes(domain);
        }
const snippet = extractDomain('https://arxiv.org/abs/2102.07350');
console.log(containsArxiv(demo, 496, 600, 'https://arxiv.org/abs/2102.07350'));
// console.log(demo.substring(496, 600));
// console.log(snippet);
// console.log(demo.includes('arxiv.org'));
// connection.query('SELECT url FROM url', (err, rows, fields) => {
//     if (err) throw err;
//     for (let i = 0; i < rows.length; i++) {
//         // 假設我們想檢查整個 url 字段，並將其與自己進行比較
//         console.log(containsDomain(rows[i].url, 0, rows[i].url.length, rows[i].url));
//     }
// });


connection.end();
