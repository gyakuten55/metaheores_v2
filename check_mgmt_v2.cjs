const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // 別のURL形式を試す
    const url = `https://management.microcms.io/api/v1/services/${MICROCMS_SERVICE_DOMAIN}/endpoints`;
    console.log(`Checking: ${url}`);
    
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        console.log("Found endpoints:", res.data.endpoints.map(e => e.endpoint));

        for (const e of res.data.endpoints) {
            const schemaUrl = `https://management.microcms.io/api/v1/services/${MICROCMS_SERVICE_DOMAIN}/endpoints/${e.endpoint}`;
            const schemaRes = await axios.get(schemaUrl, {
                headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
            });
            const field = schemaRes.data.schema.find(f => f.fieldId === 'category_new');
            if (field) {
                console.log(`\n--- OPTIONS FOR ${e.endpoint} ---`);
                console.log(JSON.stringify(field.selectLabels, null, 2));
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log(e.response.data);
    }
}

main();
