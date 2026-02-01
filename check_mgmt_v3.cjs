const axios = require('axios');

const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    // 汎用的なマネジメントAPIのベースURL
    const url = `https://management.microcms.io/api/v1/endpoints`;
    console.log(`Checking: ${url}`);
    
    try {
        const res = await axios.get(url, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        console.log("Success!");
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log(JSON.stringify(e.response.data, null, 2));
    }
}

main();
