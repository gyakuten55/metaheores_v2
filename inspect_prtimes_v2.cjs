const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // 1. Create Category
    console.log("--- Creating/Checking 'PRtimes' Category ---");
    try {
        // First check if it exists
        const catRes = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/categories`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100 }
        });
        
        let prCategory = catRes.data.contents.find(c => c.name === 'PRtimes');
        
        if (prCategory) {
            console.log(`Category 'PRtimes' already exists. ID: ${prCategory.id}`);
        } else {
            console.log("Creating 'PRtimes' category...");
            const createRes = await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/categories`, {
                name: 'PRtimes'
            }, {
                headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
            });
            prCategory = createRes.data;
            console.log(`Created 'PRtimes' category. ID: ${prCategory.id}`);
        }
    } catch (e) {
        console.error("Category operation failed:", e.message);
        if (e.response) console.error(JSON.stringify(e.response.data));
    }

    // 2. Inspect PR Times HTML
    console.log("\n--- Inspecting PR Times HTML ---");
    try {
        const prRes = await axios.get('https://prtimes.jp/main/html/searchrlp/company_id/94539', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(prRes.data);
        
        // Print the first 2000 characters of the body to see the structure
        const bodyStart = $('body').html().substring(0, 3000);
        console.log("Body Start:\n ", bodyStart);
        
        // Try to find elements with specific text or tags
        const timeElements = $('time');
        console.log(`Found ${timeElements.length} <time> elements.`);
        if (timeElements.length > 0) {
            console.log("First time element parent HTML:", $(timeElements[0]).parent().html());
        }

    } catch (e) {
        console.error("Failed to fetch PR Times:", e.message);
    }
}

main();
