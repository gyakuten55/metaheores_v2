const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // マネジメントAPIの標準的なURL形式
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/news`;
    
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        const field = res.data.schema.find(f => f.fieldId === 'category_new');
        if (field && field.selectLabels) {
            console.log('--- SYNC_START ---');
            console.log(JSON.stringify(field.selectLabels));
            console.log('--- SYNC_END ---');
        } else {
            // エンドポイント名が違う可能性（blogsなど）を考慮し一覧を取得
            const listRes = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints`, {
                headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
            });
            console.log('Available Endpoints:', listRes.data.endpoints.map(e => e.endpoint));
        }
    } catch (e) {
        // 別パターンのURL
        try {
            const url2 = `https://management.microcms.io/api/v1/services/${MICROCMS_SERVICE_DOMAIN}/endpoints/news`;
            const res2 = await axios.get(url2, {
                headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
            });
            const field = res2.data.schema.find(f => f.fieldId === 'category_new');
            console.log('--- SYNC_START ---');
            console.log(JSON.stringify(field.selectLabels));
            console.log('--- SYNC_END ---');
        } catch (e2) {
            console.error("Failed to sync schema. Please check if the endpoint name 'news' is correct.");
        }
    }
}

main();
