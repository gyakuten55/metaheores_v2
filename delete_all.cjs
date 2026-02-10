const axios = require('axios');
const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function main() {
  const { data } = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs?limit=100`, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
  });
  console.log(`Found ${data.contents.length} articles to delete.`);
  for (const item of data.contents) {
    await axios.delete(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs/${item.id}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
    });
    console.log(`Deleted: ${item.id}`);
  }
}
main();
