const axios = require('axios');

async function test(domain, apiKey) {
    console.log(`Testing domain: ${domain}`);
    try {
        const res = await axios.get(`https://${domain}.microcms.io/api/v1/news`, {
            headers: { 'X-MICROCMS-API-KEY': apiKey },
            params: { limit: 1 }
        });
        console.log(`Success for domain: ${domain}`);
        return true;
    } catch (e) {
        console.log(`Failed for domain: ${domain} (${e.response?.status})`);
        return false;
    }
}

const key = '3cEPye52LNlCwgRRAydNRajAvav3lR9EOCmU';
test('mh-members', key);
test('metaheroes-members', key);
test('metaheroes-blog', key);
test('metaheroes', key);
test('g07uki3u26', key);
