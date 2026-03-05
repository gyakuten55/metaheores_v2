const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';
const MICROCMS_ENDPOINT = 'blogs';

async function extract(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    
    // 1. Precise Title Extraction from DOM
    let title = $('h1').text().trim();
    if (!title) {
        title = ($('meta[property="og:title"]').attr('content') || $('title').text()).split('|')[0].trim();
    }
    
    // 2. Eyecatch URL
    const eyecatchUrl = $('meta[property="og:image"]').attr('content') || '';
    
    const match = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return { title, body: '', eyecatch_url: eyecatchUrl, publishedAt: '' };
    
    const data = JSON.parse(match[1]);
    const slug = url.split('/').pop();
    
    // 3. Image URL Extraction from Data
    const images = new Set();
    if (eyecatchUrl) images.add(eyecatchUrl);
    for (const val of data) {
        if (typeof val === 'string' && val.startsWith('http')) {
            if (val.includes('studio-cms-assets') || val.includes('production-os-assets') || val.includes('prcdn.freetls.fastly.net')) {
                images.add(val);
            }
        }
    }

    // 4. Body Construction
    let body = '';
    const bodyCandidates = data.filter(v => typeof v === 'string' && v.startsWith('<') && v.length > 500);
    if (bodyCandidates.length > 0) {
        body = bodyCandidates.sort((a, b) => b.length - a.length)[0];
    }

    // Enhanced Body with mandatory images
    let enhancedBody = '';
    if (eyecatchUrl) {
        enhancedBody += `<img src="${eyecatchUrl}" alt="eyecatch" style="max-width:100%; height:auto; border-radius:8px; margin-bottom:24px;"><br>`;
    }
    enhancedBody += body;
    
    // Add missing images at the end
    let gallery = '';
    for (const img of images) {
        if (!body.includes(img) && img !== eyecatchUrl) {
            gallery += `<br><img src="${img}" style="max-width:100%; height:auto; margin: 20px 0;"><br>`;
        }
    }
    if (gallery) enhancedBody += '<hr>' + gallery;

    enhancedBody = enhancedBody.replace(/src="\//g, 'src="https://meta-heroes.co.jp/');

    // 5. Date
    let publishedAt = '';
    const dates = data.filter(v => Array.isArray(v) && v[0] === 'Date');
    if (dates.length > 0) publishedAt = dates[0][1];

    return { title, body: enhancedBody, eyecatch_url: eyecatchUrl, publishedAt };
  } catch (e) {
    console.error(`Error fetching ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  const sitemapUrl = 'https://meta-heroes.co.jp/sitemap-dynamic/sitemap-dynamic-news-s--c-slug.xml';
  const { data: sitemapXml } = await axios.get(sitemapUrl);
  const urls = sitemapXml.match(/https:\/\/meta-heroes.co.jp\/news\/[^<]+/g);
  
  console.log(`Found ${urls.length} articles. Starting re-import with fixed titles and images...`);

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
      console.log(`  Imported: ${article.title}`);
    } catch (e) {
      console.error(`  Failed ${article.title}: ${e.response?.data?.message || e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Done!');
}
main();
