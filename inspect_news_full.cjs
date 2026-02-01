const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    console.log("--- Inspecting Full News Article ---");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 1 }
        });
        
        if (res.data.contents.length > 0) {
            console.log(JSON.stringify(res.data.contents[0], null, 2));
        } else {
            console.log("No articles found.");
        }
    } catch (e) {
        console.error("Failed to fetch news:", e.message);
    }
}

main();
