const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // news エンドポイントのスキーマを取得
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/news`;
    
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        // category_new フィールドを探す
        const field = res.data.schema.find(f => f.fieldId === 'category_new');
        
        if (field && field.selectLabels) {
            console.log('--- CORRECT_CATEGORY_LABELS ---');
            console.log(JSON.stringify(field.selectLabels, null, 2));
            console.log('--- FIELD_INFO ---');
            console.log(`Field Name: ${field.name}`);
            console.log(`Type: ${field.kind}`);
        } else {
            // 見つからない場合は全スキーマを出す
            console.log('Field category_new not found. Listing all fields:');
            res.data.schema.forEach(f => console.log(`- ${f.fieldId} (${f.name})`));
        }
    } catch (e) {
        console.error("Management API Error:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.log("Response Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
