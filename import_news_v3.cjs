const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';
const MICROCMS_ENDPOINT = 'blogs';

async function extract(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    
    // Eyecatch from OG image
    const eyecatchUrl = $('meta[property="og:image"]').attr('content');
    
    const match = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    const slug = url.split('/').pop();
    
    // Find article indices
    let articleIndex = -1;
    for (let i = 0; i < data.length; i++) {
        if (data[i] === slug && typeof data[i+1] === 'string' && data[i+1].startsWith('<')) {
            articleIndex = i;
            break;
        }
    }

    // Comprehensive Image Extraction from Nuxt Data
    const images = new Set();
    if (eyecatchUrl) images.add(eyecatchUrl);
    
    // Scan entire data array for STUDIO assets
    for (const val of data) {
        if (typeof val === 'string' && val.startsWith('http')) {
            if (val.includes('studio-cms-assets') || val.includes('production-os-assets') || val.includes('prcdn.freetls.fastly.net')) {
                images.add(val);
            }
        }
    }

    let title = '';
    let body = '';
    if (articleIndex !== -1) {
        title = data[articleIndex - 1];
        body = data[articleIndex + 1];
    } else {
        // Fallback to OG title
        title = ($('meta[property="og:title"]').attr('content') || $('title').text()).split('|')[0].trim();
        // Fallback body: look for longest HTML string
        body = data.filter(v => typeof v === 'string' && v.startsWith('<') && v.length > 500).sort((a,b) => b.length - a.length)[0] || '';
    }

    // Construct Body with visible images
    let enhancedBody = '';
    if (eyecatchUrl) {
        enhancedBody += `<img src="${eyecatchUrl}" alt="eyecatch" style="max-width:100%; height:auto; display:block; margin: 0 auto 20px;"><br>`;
    }
    
    enhancedBody += body;
    
    // Append all other images found in data at the bottom
    let gallery = '<div class="article-gallery" style="margin-top:40px;">';
    let hasExtra = false;
    for (const img of images) {
        if (!body.includes(img) && img !== eyecatchUrl) {
            gallery += `<img src="${img}" style="max-width:100%; height:auto; display:block; margin: 20px auto;"><br>`;
            hasExtra = true;
        }
    }
    gallery += '</div>';
    
    if (hasExtra) enhancedBody += gallery;

    // Fix broken relative links if any
    enhancedBody = enhancedBody.replace(/src="\//g, 'src="https://meta-heroes.co.jp/');

    let publishedAt = '';
    const dates = data.filter(v => Array.isArray(v) && v[0] === 'Date');
    if (dates.length > 0) publishedAt = dates[0][1];

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
  
  console.log(`Found ${urls.length} articles. Starting re-import...`);

  for (const url of urls) {
    const slug = url.split('/').pop();
    const article = await extract(url);
    if (!article) continue;

    try {
      const payload = {
        title: article.title,
        content: article.body,
        eyecatch_url: article.eyecatch_url,
        publishedAt: article.publishedAt
      };

      await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
        headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
      });
      console.log(`Imported: ${article.title}`);
    } catch (e) {
      console.error(`Failed ${article.title}: ${e.response?.data?.message || e.message}`);
    }
    await new Promise(r => setTimeout(resolve, 200));
  }
}
main();
