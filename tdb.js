
import https from 'https';
function getFinalURL(originalURL, callback) {
    function followRedirect(url) {
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // 繼續跟蹤重定向
                followRedirect(response.headers.location);
            } else {
                // 當找到最終的 URL，呼叫回調函數並返回原始和最終的 URL
                callback(originalURL, url);
            }
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    }

    followRedirect(originalURL);
}

// 這裡的 URL 應該是您要檢查的原始 URL
const originalURL = "https://doi.org/10.18653%2FV1%2F2021.EMNLP-MAIN.243";

getFinalURL(originalURL, (originalURL, finalURL) => {
    console.log("Original URL was:", originalURL);
    console.log("Final URL is:", finalURL);
});
