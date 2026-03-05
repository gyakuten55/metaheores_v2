const axios = require('axios');
async function test() {
  const url = 'https://meta-heroes.co.jp/news/5RhJhgCB';
  const { data: html } = await axios.get(url);
  const match = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const data = JSON.parse(match[1]);
  const slug = '5RhJhgCB';
  
  // Find the object that has the slug
  let title = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i] === slug) {
      // In Studio/Nuxt, the title is usually the element immediately PRECEDING the slug in the data array
      // based on the object property order { title: "...", slug: "..." }
      if (typeof data[i-1] === 'string' && data[i-1].length > 5) {
        title = data[i-1];
        break;
      }
    }
  }
  console.log('Detected Title:', title);
}
test();
