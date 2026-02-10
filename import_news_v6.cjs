const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';
const MICROCMS_ENDPOINT = 'blogs';

async function extract(url) {
  try {
    const { data: html } = await axios.get(url);
    const match = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    const slug = url.split('/').pop();
    
    // Find Article Object
    let articleObj = null;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            if (data[item.slug] === slug && item.title && item.body) {
                articleObj = item;
                break;
            }
        }
    }

    if (!articleObj) return null;

    let title = data[articleObj.title];
    let body = data[articleObj.body];
    let eyecatchUrl = '';
    
    if (articleObj.eyecatch) {
        eyecatchUrl = data[articleObj.eyecatch];
    }
    
    // If title still looks like HTML, clean it
    if (title && title.includes('<')) {
        title = cheerio.load(title).text().trim();
    }

    // Comprehensive Image Recovery
    const imagesInBody = new Set();
    const $body = cheerio.load(body);
    $body('img').each((i, el) => imagesInBody.add($body(el).attr('src')));

    // Collect all article-related images from data array
    const allPossibleImages = new Set();
    for (const val of data) {
        if (typeof val === 'string' && val.startsWith('http') && 
           (val.includes('studio-cms-assets') || val.includes('production-os-assets') || val.includes('prcdn.freetls.fastly.net'))) {
            allPossibleImages.add(val);
        }
    }

    let enhancedBody = '';
    if (eyecatchUrl) {
        enhancedBody += `<img src="${eyecatchUrl}" alt="eyecatch" style="max-width:100%; height:auto; margin-bottom:20px;"><br>`;
    }
    enhancedBody += body;
    
    // Append missing images
    let extra = '';
    for (const img of allPossibleImages) {
        if (!body.includes(img) && img !== eyecatchUrl) {
            extra += `<br><img src="${img}" style="max-width:100%; height:auto; margin: 20px 0;"><br>`;
        }
    }
    if (extra) enhancedBody += '<hr><h3>関連画像</h3>' + extra;

    enhancedBody = enhancedBody.replace(/src="\//g, 'src="https://meta-heroes.co.jp/');

    let publishedAt = '';
    if (articleObj._meta && data[articleObj._meta] && data[articleObj._meta].publishedAt) {
        const pIndex = data[articleObj._meta].publishedAt;
        if (Array.isArray(data[pIndex]) && data[pIndex][0] === 'Date') {
            publishedAt = data[pIndex][1];
        }
    }

    return { title, body: enhancedBody, eyecatch_url: eyecatchUrl, publishedAt };
  } catch (e) {
    console.error(`Error ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  const sitemapUrl = 'https://meta-heroes.co.jp/sitemap-dynamic/sitemap-dynamic-news-s--c-slug.xml';
  const { data: sitemapXml } = await axios.get(sitemapUrl);
  const urls = sitemapXml.match(/https:\/\/meta-heroes.co.jp\/news\/[^<]+/g);
  
  console.log(`Starting definitive re-import of ${urls.length} articles...`);

  for (const url of urls) {
    const article = await extract(url);
    if (!article || !article.title) continue;

    try {
      await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, {
        title: article.title,
        content: article.body,
        eyecatch_url: article.eyecatch_url,
        publishedAt: article.publishedAt
      }, {
        headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
      });
      console.log(`  OK: ${article.title}`);
    } catch (e) {
      console.error(`  ERR ${article.title}: ${e.response?.data?.message || e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Finished!');
}
main();
