const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    console.log("--- Checking MicroCMS Categories ---");
    try {
        const catRes = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/categories`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
        });
        console.log("Categories:", JSON.stringify(catRes.data.contents, null, 2));
    } catch (e) {
        console.error("Failed to fetch categories:", e.message);
    }

    console.log("\n--- Checking PR Times Structure ---");
    try {
        // PR Times headers to mimic a browser to avoid 403s if any
        const prRes = await axios.get('https://prtimes.jp/main/html/searchrlp/company_id/94539', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(prRes.data);
        
        // Try to find the article list container
        // Common PR Times classes: .company-press-release-list, .item-list, article
        // We will print the first item's HTML
        const firstArticle = $('article').first().html() || $('.item-list__item').first().html() || "No article found with standard selectors";
        
        console.log("First Article HTML Snippet:");
        console.log(firstArticle.substring(0, 1000)); // Limit output

        // Also print the container class if possible
        if ($('article').length > 0) console.log("Found <article> elements.");
        if ($('.item-list__item').length > 0) console.log("Found .item-list__item elements.");

    } catch (e) {
        console.error("Failed to fetch PR Times:", e.message);
    }
}

main();
