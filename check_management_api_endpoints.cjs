const axios = require('axios');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MANAGEMENT_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
    console.log("--- Checking microCMS Management API (Endpoints) ---");
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/endpoints`, {
            headers: { 'X-MICROCMS-MANAGE-API-KEY': MANAGEMENT_API_KEY }
        });
        
        console.log("Endpoints:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Management API check failed:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
