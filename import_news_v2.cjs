const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';
const MICROCMS_ENDPOINT = 'blogs';

async function extract(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    
    // 1. Get Eyecatch from OG Tag
    const eyecatchUrl = $('meta[property="og:image"]').attr('content');
    
    const match = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    const slug = url.split('/').pop();
    
    // 2. Identify the article object
    let articleObj = null;
    let articleIndex = -1;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            if (data[item.slug] === slug && item.body && item.title) {
                articleObj = item;
                articleIndex = i;
                break;
            }
        }
    }

    if (!articleObj) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                const values = Object.values(item);
                if (values.some(v => data[v] === slug)) {
                    if (item.title && item.body) {
                        articleObj = item;
                        articleIndex = i;
                        break;
                    }
                }
            }
        }
    }

    if (!articleObj) return null;

    const title = data[articleObj.title];
    let body = data[articleObj.body];
    
    // 3. Extract ALL image URLs from data related to this article
    const images = new Set();
    if (eyecatchUrl) images.add(eyecatchUrl);
    
    // Search within a range around the article object
    const start = Math.max(0, articleIndex - 200);
    const end = Math.min(data.length, articleIndex + 200);
    for (let i = start; i < end; i++) {
        const val = data[i];
        if (typeof val === 'string' && val.startsWith('http')) {
            if (val.includes('studio-cms-assets') || val.includes('production-os-assets') || val.includes('prcdn.freetls.fastly.net')) {
                images.add(val);
            }
        }
    }

    // 4. Construct enhanced body
    // Prepend eyecatch
    let enhancedBody = '';
    if (eyecatchUrl) {
        enhancedBody += `<img src="${eyecatchUrl}" alt="eyecatch" style="max-width:100%; height:auto;"><br><br>`;
    }
    
    enhancedBody += body;
    
    // Append other images found (that are not already in the body)
    let extraImages = '';
    for (const img of images) {
        if (!body.includes(img) && img !== eyecatchUrl) {
            extraImages += `<br><img src="${img}" style="max-width:100%; height:auto;"><br>`;
        }
    }
    enhancedBody += extraImages;

    let publishedAt = '';
    if (articleObj._meta && data[articleObj._meta] && data[articleObj._meta].publishedAt) {
        const pIndex = data[articleObj._meta].publishedAt;
        if (Array.isArray(data[pIndex]) && data[pIndex][0] === 'Date') {
            publishedAt = data[pIndex][1];
        }
    }
    if (!publishedAt) {
        const dates = data.filter(v => Array.isArray(v) && v[0] === 'Date');
        if (dates.length > 0) publishedAt = dates[0][1];
    }

    return { title, slug, body: enhancedBody, publishedAt };
  } catch (e) {
    console.error(`Error fetching ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('Fetching sitemap...');
  const sitemapUrl = 'https://meta-heroes.co.jp/sitemap-dynamic/sitemap-dynamic-news-s--c-slug.xml';
  const { data: sitemapXml } = await axios.get(sitemapUrl);
  const urls = sitemapXml.match(/https:\/\/meta-heroes.co.jp\/news\/[^<]+/g);
  
  if (!urls) {
    console.error('No URLs found in sitemap');
    return;
  }

  console.log(`Found ${urls.length} articles. Importing to microCMS...`);

  for (const url of urls) {
    const slug = url.split('/').pop();
    console.log(`Processing ${slug}...`);
    
    const article = await extract(url);
    if (!article || !article.title) {
      console.log(`  Skipping ${slug}: could not extract data`);
      continue;
    }

    try {
      const payload = {
        title: article.title,
        content: article.body,
        publishedAt: article.publishedAt
      };

      await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
        headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
      });
      console.log(`  Imported: ${article.title}`);
    } catch (e) {
      console.error(`  Error importing ${article.title}: ${e.response?.data?.message || e.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('Done!');
}

main();
