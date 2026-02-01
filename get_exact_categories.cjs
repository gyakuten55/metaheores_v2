const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // マネジメントAPIの正しいエンドポイントを確認
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/news`;
    console.log(`Checking: ${url}`);
    
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        const field = res.data.schema.find(f => f.fieldId === 'category_new');
        if (field && field.selectLabels) {
            console.log('--- ACTUAL_SELECT_LABELS ---');
            console.log(JSON.stringify(field.selectLabels, null, 2));
            console.log('---------------------------');
        } else {
            console.log('Field category_new not found or has no selectLabels');
            console.log('Full Schema Fields:', res.data.schema.map(f => f.fieldId));
        }
    } catch (e) {
        console.error("Failed to fetch schema:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", e.response.data);
        }
    }
}

main();
