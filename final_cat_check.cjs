const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    console.log("Fetching all possible news contents to find categories...");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100, fields: 'category_new' }
        });
        
        const categories = new Set();
        res.data.contents.forEach(item => {
            if (item.category_new && Array.isArray(item.category_new)) {
                item.category_new.forEach(c => categories.add(c));
            }
        });
        
        console.log("Found Categories:", Array.from(categories));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
