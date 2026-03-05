const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    console.log("--- Collecting All Unique Categories ---");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100, fields: 'category_new' }
        });
        
        const categories = new Set();
        res.data.contents.forEach(item => {
            if (item.category_new) {
                item.category_new.forEach(cat => categories.add(cat));
            }
        });
        
        console.log("Found categories:", Array.from(categories));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
