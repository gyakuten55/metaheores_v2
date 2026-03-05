const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function tryEndpoint(endpoint) {
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints/${endpoint}`;
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        const field = res.data.schema.find(f => f.fieldId === 'category_new');
        if (field && field.selectLabels) {
            return field.selectLabels;
        }
    } catch (e) {}
    return null;
}

async function main() {
    // news と blogs の両方を試す
    let labels = await tryEndpoint('news');
    if (!labels) labels = await tryEndpoint('blogs');
    
    if (labels) {
        console.log('--- SYNC_DATA ---');
        console.log(JSON.stringify(labels));
        console.log('--- END ---');
    } else {
        console.log('FAILED');
    }
}

main();
