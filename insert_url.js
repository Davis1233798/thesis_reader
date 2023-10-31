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
const dataArray = ['https://ar.wikipedia.org/wiki/%D9%87%D9%86%D8%AF%D8%B3%D8%A9_%D9%81%D9%88%D8%B1%D9%8A%D8%A9', 'https://bn.wikipedia.org/wiki/%E0%A6%B8%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A6%95_%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%95%E0%A7%8C%E0%A6%B6%E0%A6%B2', 'https://ca.wikipedia.org/wiki/Enginyeria_Prompt', 'https://cs.wikipedia.org/wiki/Prompt_engineering', 'https://de.wikipedia.org/wiki/Prompt_Engineering', 'https://es.wikipedia.org/wiki/Ingenier%C3%ADa_r%C3%A1pida', 'https://fa.wikipedia.org/wiki/%D9%85%D9%87%D9%86%D8%AF%D8%B3%DB%8C_%D9%BE%D8%B1%D8%B3%D8%B4', 'https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8_%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EB%A7%81', 'https://zu.wikipedia.org/wiki/UmNgcikisho_wemfunzelelo', 'https://he.wikipedia.org/wiki/%D7%94%D7%A0%D7%93%D7%A1%D7%AA_%D7%A4%D7%A8%D7%95%D7%9E%D7%A4%D7%98%D7%99%D7%9D', 'https://mr.wikipedia.org/wiki/%E0%A4%B8%E0%A5%82%E0%A4%9A%E0%A4%A8%E0%A4%BE_%E0%A4%85%E0%A4%AD%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%82%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A5%80', 'https://nl.wikipedia.org/wiki/Prompt_engineering', 'https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%83%AA%E3%83%B3%E3%82%B0', 'https://pl.wikipedia.org/wiki/In%C5%BCynieria_podpowiedzi', 'https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B0_%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B7%D0%BE%D0%BA', 'https://sl.wikipedia.org/wiki/Ustvarjanje_izto%C4%8Dnic', 'https://fi.wikipedia.org/wiki/Kehotesuunnittelu', 'https://tr.wikipedia.org/wiki/Sufle_m%C3%BChendisli%C4%9Fi', 'https://uk.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D1%8E%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F_%D0%BF%D1%96%D0%B4%D0%BA%D0%B0%D0%B7%D0%BE%D0%BA', 'https://zh-yue.wikipedia.org/wiki/%E6%8F%90%E7%A4%BA%E5%B7%A5%E7%A8%8B', 'https://zh.wikipedia.org/wiki/%E6%8F%90%E7%A4%BA%E5%B7%A5%E7%A8%8B', 'https://www.wikidata.org/wiki/Special:EntityPage/Q108941486#sitelinks-wikipedia', 'https://www.wikidata.org/wiki/Special:EntityPage/Q108941486', 'https://commons.wikimedia.org/wiki/Category:Prompt_engineering_for_generative_AI', 'https://cdn.openart.ai/assets/Stable%20Diffusion%20Prompt%20Book%20From%20OpenArt%2011-13.pdf', 'https://github.blog/2023-07-17-prompt-engineering-guide-generative-ai-llms/', 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf', 'https://openai.com/blog/chatgpt', 'https://zapier.com/blog/gpt-prompt/', 'https://masterofcode.com/blog/the-ultimate-guide-to-gpt-prompt-engineering', 'https://contractnerds.com/how-to-prime-and-prompt-chatgpt-for-more-reliable-contract-drafting-support', 'https://platform.openai.com/docs/guides/gpt-best-practices', 'https://arxiv.org/abs/2208.01066', 'https://arxiv.org/archive/cs.CL', 'https://www.technologyreview.com/2022/04/06/1049061/dalle-openai-gpt3-ai-agi-multimodal-image-generation/', 'https://techcrunch.com/2023/06/12/meta-open-sources-an-ai-powered-music-generator/', 'https://claid.ai/blog/article/prompt-guide/', 'https://arxiv.org/abs/2206.07682', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2210.14891', 'https://arxiv.org/abs/2206.07682', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2201.11903', 'https://arxiv.org/archive/cs.CL', 'https://www.scientificamerican.com/article/how-ai-knows-things-no-one-told-it/', 'https://arxiv.org/abs/2212.07677', 'https://arxiv.org/archive/cs.LG', 'https://www.alignmentforum.org/tag/mesa-optimization', 'https://arxiv.org/abs/2208.01066', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2110.08207', 'https://arxiv.org/archive/cs.LG', 'https://arxiv.org/abs/2202.01279', 'https://arxiv.org/archive/cs.LG', 'https://ai.googleblog.com/2022/05/language-models-perform-reasoning-via.html', 'https://www.nytimes.com/2023/06/23/technology/ai-chatbot-life-coach.html', 'https://www.nytimes.com/2023/05/25/technology/ai-chatbot-chatgpt-prompts.html', 'https://www.worldcat.org/issn/0362-4331', 'https://www.cnet.com/tech/services-and-software/googles-latest-ai-model-can-be-taught-how-to-solve-problems/', 'https://www.cnet.com/tech/services-and-software/googles-latest-ai-model-can-be-taught-how-to-solve-problems/', 'https://ai.googleblog.com/2022/04/pathways-language-model-palm-scaling-to.html', 'https://venturebeat.com/ai/harnessing-the-power-of-gpt-3-in-scientific-research/', 'https://www.searchenginejournal.com/google-chain-of-thought-prompting/450106/', 'https://www.zdnet.com/article/amazons-alexa-scientists-demonstrate-bigger-ai-isnt-always-better/', 'https://arxiv.org/abs/2205.11916', 'https://arxiv.org/archive/cs.CL', 'https://venturebeat.com/ai/llms-have-not-learned-our-language-were-trying-to-learn-theirs%EF%BF%BC/', 'https://arxiv.org/abs/2210.11416', 'https://arxiv.org/archive/cs.LG', 'https://ai.googleblog.com/2022/11/better-language-models-without-massive.html', 'https://aclanthology.org/2022.acl-long.225', 'https://doi.org/10.18653%2Fv1%2F2022.acl-long.225', 'https://api.semanticscholar.org/CorpusID:239016123', 'https://ui.adsabs.harvard.edu/abs/2022arXiv220510625Z', 'https://arxiv.org/abs/2205.10625', 'https://arxiv.org/abs/2203.11171', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2302.12246', 'https://arxiv.org/archive/cs.CL', 'https://ui.adsabs.harvard.edu/abs/2022arXiv221000720F', 'https://arxiv.org/abs/2210.00720', 'https://ui.adsabs.harvard.edu/abs/2023arXiv230317651M', 'https://arxiv.org/abs/2303.17651', 'https://arxiv.org/abs/2305.08291', 'https://arxiv.org/archive/cs.AI', 'https://arxiv.org/abs/2305.10601', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2205.11822', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2302.11520', 'https://arxiv.org/archive/cs.CL', 'https://arxiv.org/abs/2303.08774', 'https://arxiv.org/archive/cs.CL', 'https://proceedings.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html', 'https://arxiv.org/abs/2005.11401', 'https://arxiv.org/abs/2211.01910', 'https://arxiv.org/archive/cs.LG', 'https://arxiv.org/abs/2210.03493', 'https://arxiv.org/archive/cs.CL', 'https://medium.com/mlearning-ai/dall-e2-vs-stable-diffusion-same-prompt-different-results-e795c84adc56', 'https://docs.midjourney.com/docs/prompts', 'https://stable-diffusion-art.com/prompt-guide/', 'https://www.technologyreview.com/2022/09/16/1059598/this-artist-is-dominating-ai-generated-art-and-hes-not-happy-about-it/', 'https://minimaxir.com/2022/11/stable-diffusion-negative-prompt/', 'https://arxiv.org/abs/2208.01618', 'https://arxiv.org/archive/cs.CV', 'https://arxiv.org/abs/2304.02643', 'https://arxiv.org/archive/cs.CV', 'https://doi.org/10.18653%2FV1%2F2021.ACL-LONG.353', 'https://api.semanticscholar.org/CorpusID:230433941', 'https://arxiv.org/abs/2104.08691', 'https://doi.org/10.18653%2FV1%2F2021.EMNLP-MAIN.243', 'https://api.semanticscholar.org/CorpusID:233296808', 'https://arxiv.org/abs/2302.11521', 'https://arxiv.org/archive/cs.CL', 'https://aclanthology.org/2020.emnlp-main.346', 'https://doi.org/10.18653%2Fv1%2F2020.emnlp-main.346', 'https://api.semanticscholar.org/CorpusID:226222232', 'http://simonwillison.net/2022/Sep/12/prompt-injection/', 'https://hackaday.com/2022/09/16/whats-old-is-new-again-gpt-3-prompt-injection-attack-affects-ai/', 'https://www.theregister.com/2022/09/19/in_brief_security/', 'https://research.nccgroup.com/2022/12/05/exploring-prompt-injection-attacks/', 'https://simonwillison.net/2022/Sep/12/prompt-injection/', 'https://learnprompting.org/docs/prompt_hacking/jailbreaking', 'https://learnprompting.org/docs/prompt_hacking/leaking', 'https://www.vice.com/en/article/5d9z55/jailbreak-gpt-openai-closed-source', 'https://research.nccgroup.com/2022/12/05/exploring-prompt-injection-attacks/', 'https://arstechnica.com/information-technology/2023/02/ai-powered-bing-chat-loses-its-mind-when-fed-ars-technica-article/', 'https://www.washingtonpost.com/technology/2023/02/14/chatgpt-dan-jailbreak/', 'https://time.com/6256529/bing-openai-chatgpt-danger-alignment', 'https://www.vice.com/en/article/7kxzzz/hackers-bing-ai-scammer', 'https://arxiv.org/abs/2302.12173', 'https://arxiv.org/archive/cs.CR', 'https://vulcan.io/blog/ai-hallucinations-package-risk/', 'https://www.sciencedirect.com/science/article/abs/pii/S0019057820304092', 'https://doi.org/10.1016%2Fj.isatra.2020.10.014', 'https://www.worldcat.org/issn/0019-0578', 'https://www.computerweekly.com/opinion/Data-integration-remains-essential-for-AI-and-machine-learning', 'https://venturebeat.com/ai/is-it-time-to-shield-ai-with-a-firewall-arthur-ai-thinks-so/', 'https://github.com/protectai/rebuff', 'https://blog.langchain.dev/rebuff/', 'https://www.wired.com/story/ai-adversarial-attacks/', 'https://www.computerweekly.com/opinion/Consciousness-to-address-AI-safetyy-and-security', 'https://www.linkedin.com/feed/update/urn:li:activity:7107414897394622464/', 'https://www.wikidata.org/wiki/Wikidata:Scholia', 'https://iw.toolforge.org/scholia/topic/Q108941486', 'https://en.wikipedia.org/w/index.php?title=Prompt_engineering&oldid=1181892711', 'https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy', 'https://foundation.wikimedia.org/wiki/Special:MyLanguage/Universal_Code_of_Conduct', 'https://developer.wikimedia.org', 'https://stats.wikimedia.org/#/en.wikipedia.org', 'https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement', 'https://wikimediafoundation.org/', 'https://www.mediawiki.org/'];

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