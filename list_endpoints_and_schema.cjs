const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    try {
        console.log("Listing all endpoints...");
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints`, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        console.log("Found endpoints:");
        res.data.endpoints.forEach(e => {
            console.log(`- ID: ${e.endpoint}, Name: ${e.name}`);
        });

        // それぞれのスキーマをチェック
        for (const e of res.data.endpoints) {
            console.log(`
Checking schema for: ${e.endpoint}`);
            const schemaRes = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/${e.endpoint}`, {
                headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
            });
            const field = schemaRes.data.schema.find(f => f.fieldId === 'category_new');
            if (field) {
                console.log(`[FOUND] Field 'category_new' in endpoint '${e.endpoint}'`);
                console.log("Options:", JSON.stringify(field.selectLabels, null, 2));
            }
        }
    } catch (e) {
        console.error("Management API Error:", e.message);
        if (e.response) console.error(e.response.data);
    }
}

main();
