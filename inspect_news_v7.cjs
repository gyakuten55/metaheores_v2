const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    console.log("--- Inspecting News Articles ---");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 10 }
        });
        
        res.data.contents.forEach(item => {
            console.log(`Title: ${item.title}`);
            console.log(`Category_new:`, JSON.stringify(item.category_new));
            console.log('---');
        });
    } catch (e) {
        console.error("Failed to fetch news:", e.message);
    }
}

main();
