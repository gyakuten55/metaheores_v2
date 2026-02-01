const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    console.log("Fetching news to find categories...");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100 }
        });
        
        const categories = new Set();
        res.data.contents.forEach(item => {
            if (item.category_new) {
                if (Array.isArray(item.category_new)) {
                    item.category_new.forEach(c => categories.add(c));
                } else {
                    categories.add(item.category_new);
                }
            }
        });
        
        console.log("Categories found in data:", Array.from(categories));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
