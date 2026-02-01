const axios = require('axios');

const SERVICE_DOMAIN = 'tsrozu3k55';
const API_KEY = '3cEPye52LNlCwgRRAydNRajAvav3lR9EOCmU';
const ENDPOINT = 'blogs';

async function main() {
    console.log(`Testing endpoint: https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`);
    try {
        const res = await axios.get(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`, {
            headers: { 'X-MICROCMS-API-KEY': API_KEY },
            params: { limit: 5 }
        });
        console.log('Success!');
        console.log('Total Count:', res.data.totalCount);
        if (res.data.contents.length > 0) {
            console.log('First Item Sample:', JSON.stringify({
                id: res.data.contents[0].id,
                title: res.data.contents[0].title,
                category: res.data.contents[0].category, // Check how category is structured
                publishedAt: res.data.contents[0].publishedAt
            }, null, 2));
        }
        
        // Also check categories if possible
        console.log('\nChecking categories...');
        try {
            const catRes = await axios.get(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/categories`, {
                headers: { 'X-MICROCMS-API-KEY': API_KEY }
            });
            console.log('Categories:', JSON.stringify(catRes.data.contents.map(c => ({ id: c.id, name: c.name })), null, 2));
        } catch (e) {
            console.log('Categories endpoint not available or failed.');
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', e.response.data);
        }
    }
}

main();
