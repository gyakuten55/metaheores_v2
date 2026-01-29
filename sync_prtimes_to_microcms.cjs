const axios = require('axios');
const cheerio = require('cheerio');

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';
const MICROCMS_ENDPOINT = 'news';
const PR_TIMES_COMPANY_ID = '94539';
const CATEGORY_ID = 'OsYRoqcaY-'; // カテゴリ_new (PRtimes)

/**
 * 画像をURLからダウンロードしてmicroCMSのメディアにアップロードする
 */
async function uploadImageToMicroCMS(imageUrl) {
    if (!imageUrl || imageUrl.includes('microcms-assets.io')) return imageUrl;
    try {
        console.log(`  Downloading image: ${imageUrl}`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        
        const fileName = imageUrl.split('/').pop().split('?')[0] || 'image.jpg';
        const formData = new FormData();
        const blob = new Blob([buffer], { type: response.headers.get('content-type') || 'image/jpeg' });
        formData.append('file', blob, fileName);

        console.log(`  Uploading to microCMS Media...`);
        const uploadRes = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/media`, {
            method: 'POST',
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            body: formData
        });

        if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            console.error(`  Upload failed: ${errText}`);
            return null;
        }

        const data = await uploadRes.json();
        console.log(`  Uploaded! New URL: ${data.url}`);
        return data.url;
    } catch (e) {
        console.error(`  Image upload failed: ${e.message}`);
        return null;
    }
}

async function getExistingTitles() {
    try {
        const res = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 100, fields: 'title' }
        });
        return new Set(res.data.contents.map(c => c.title));
    } catch (e) {
        return new Set();
    }
}

async function fetchArticleDetails(url) {
    const { data: html } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
    });
    const $ = cheerio.load(html);
    
    const title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
    const rawEyecatchUrl = $('meta[property="og:image"]').attr('content');
    
    let $content = $('.press-release-body-v3-0-0');
    if ($content.length === 0) $content = $('.release-body');
    
    $content.find('script, style, iframe').remove();

    // 本文内の画像をすべて抽出してアップロード・置換
    const images = $content.find('img').get();
    for (const img of images) {
        let src = $(img).attr('src');
        if (src) {
            if (src.startsWith('//')) src = 'https:' + src;
            const newUrl = await uploadImageToMicroCMS(src);
            if (newUrl) {
                $(img).attr('src', newUrl);
            }
        }
    }

    // アイキャッチのアップロード
    const eyecatchUrl = await uploadImageToMicroCMS(rawEyecatchUrl);

    return { title, content: $content.html(), eyecatchUrl };
}

async function main() {
    console.log(`--- PR Times Full Sync Started ---`);
    
    const existingTitles = await getExistingTitles();
    const rssUrl = `https://prtimes.jp/companyrdf.php?company_id=${PR_TIMES_COMPANY_ID}`;
    const { data: rssXml } = await axios.get(rssUrl);
    const $rss = cheerio.load(rssXml, { xmlMode: true });
    const items = [];
    
    $rss('item').each((i, el) => {
        const $el = $rss(el);
        const title = $el.find('title').text();
        const link = $el.find('link').text() || $el.attr('rdf:about');
        let pubDate = '';
        el.children.forEach(child => {
            if (child.name === 'dc:date' || child.name === 'date') pubDate = $rss(child).text();
        });
        items.push({ title, link, pubDate });
    });

    const filterDate = new Date('2026-01-29T00:00:00+09:00');
    const newItems = items.filter(item => {
        const d = new Date(item.pubDate);
        return d >= filterDate && !existingTitles.has(item.title);
    });

    console.log(`Found ${newItems.length} new articles to sync.`);

    for (const item of newItems) {
        console.log(`
Processing: ${item.title}`);
        try {
            const detail = await fetchArticleDetails(item.link);
            
            const payload = {
                title: detail.title || item.title,
                content: detail.content,
                category_new: [CATEGORY_ID], // 複数選択フィールドの場合
                publishedAt: item.pubDate
            };

            if (detail.eyecatchUrl) {
                payload.eyecatch = { url: detail.eyecatchUrl };
            }

            const res = await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
                headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
            });
            console.log(`  SUCCESS: Synced ID: ${res.data.id}`);

        } catch (e) {
            console.error(`  ERROR: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("\n--- Sync Finished ---");
}

main();