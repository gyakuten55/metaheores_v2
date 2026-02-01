const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function main() {
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100 }
        });
        
        const cats = new Set();
        res.data.contents.forEach(item => {
            if (item.category_new) {
                item.category_new.forEach(c => cats.add(c));
            }
        });
        console.log("ACTUAL_CATEGORIES_IN_DATA:", Array.from(cats));
    } catch (e) {
        console.error(e.message);
    }
}
main();
