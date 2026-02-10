const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    console.log("Fetching all news to extract category_new values...");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100, fields: 'category_new' }
        });
        
        const allValues = new Set();
        res.data.contents.forEach(item => {
            if (item.category_new && Array.isArray(item.category_new)) {
                item.category_new.forEach(v => allValues.add(v));
            }
        });
        
        console.log("--- ALL CATEGORIES CURRENTLY IN USE ---");
        console.log(JSON.stringify(Array.from(allValues), null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

main();
