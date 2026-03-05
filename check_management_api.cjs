const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    console.log("--- Checking microCMS Management API (Schema) ---");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/news`, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        console.log("Schema for 'news' endpoint found.");
        const categoryField = res.data.schema.find(f => f.name === 'カテゴリ_new' || f.fieldId === 'category_new');
        if (categoryField) {
            console.log("Found 'category_new' field:");
            console.log(JSON.stringify(categoryField, null, 2));
        } else {
            console.log("'category_new' field not found in schema.");
            console.log("Full Schema Fields:", res.data.schema.map(f => f.fieldId).join(', '));
        }
    } catch (e) {
        console.error("Management API check failed:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
