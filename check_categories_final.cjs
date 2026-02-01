const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';

async function checkEndpoint(endpoint) {
    console.log(`--- Checking ${endpoint} ---`);
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100 }
        });
        console.log(`Count: ${res.data.totalCount}`);
        console.log(`Contents:`, JSON.stringify(res.data.contents, null, 2));
    } catch (e) {
        console.log(`${endpoint} check failed: ${e.message}`);
    }
}

async function main() {
    await checkEndpoint('categories');
    await checkEndpoint('category');
}

main();
