import axios from 'axios';
import * as cheerio from 'cheerio';

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';
const MICROCMS_ENDPOINT = 'news';
const PR_TIMES_COMPANY_ID = '94539';

/**
 * microCMSのメディア管理に画像をアップロードする
 */
async function uploadToMicroCMSMedia(imageUrl) {
    if (!imageUrl || imageUrl.includes('microcms-assets.io')) return imageUrl;
    if (!imageUrl.startsWith('http')) return null;

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;
        const buffer = await response.arrayBuffer();
        
        const fileName = `pr_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const formData = new FormData();
        const blob = new Blob([buffer], { type: response.headers.get('content-type') || 'image/jpeg' });
        formData.append('file', blob, fileName);

        // Management API エンドポイントを優先的に使用
        const uploadRes = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/media`, {
            method: 'POST',
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            body: formData
        });

        if (uploadRes.ok) {
            const data = await uploadRes.json();
            return data.url;
        } else {
            const errText = await uploadRes.text();
            console.error(`  Management API Upload failed (${uploadRes.status}): ${errText}`);
            return null;
        }
    } catch (e) {
        console.error(`  Media Upload Error: ${e.message}`);
        return null;
    }
}

export default async function handler(req, res) {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const resList = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 10, fields: 'title' }
        });
        const existingTitles = new Set(resList.data.contents.map(c => c.title));

        const rssUrl = `https://prtimes.jp/companyrdf.php?company_id=${PR_TIMES_COMPANY_ID}`;
        const { data: rssXml } = await axios.get(rssUrl);
        const $rss = cheerio.load(rssXml, { xmlMode: true });
        const items = [];
        $rss('item').each((i, el) => {
            const $el = $rss(el);
            let pubDate = '';
            el.children.forEach(child => {
                if (child.name === 'dc:date' || child.name === 'date') pubDate = $rss(child).text();
            });
            items.push({
                title: $el.find('title').text(),
                link: $el.find('link').text() || $el.attr('rdf:about'),
                pubDate: pubDate || $el.find('pubDate').text()
            });
        });

        const filterDate = new Date('2026-01-29T00:00:00+09:00');
        const newItems = items.filter(item => {
            const d = new Date(item.pubDate);
            return d >= filterDate && !existingTitles.has(item.title);
        });

        for (const item of newItems) {
            console.log(`Processing: ${item.title}`);
            const { data: html } = await axios.get(item.link);
            const $ = cheerio.load(html);
            const ogImage = $('meta[property="og:image"]').attr('content');
            
            let $content = $('.press-release-body-v3-0-0');
            if ($content.length === 0) $content = $('.release-body');
            $content.find('script, style, iframe, .social-buttons').remove();

            const imgEls = $content.find('img').get();
            
            // 画像のアップロード
            const [uploadedEyecatchUrl, ...uploadedBodyImages] = await Promise.all([
                uploadToMicroCMSMedia(ogImage),
                ...imgEls.map(img => {
                    let src = $(img).attr('src') || $(img).attr('data-src');
                    if (src && src.startsWith('//')) src = 'https:' + src;
                    return uploadToMicroCMSMedia(src);
                })
            ]);

            // 本文置換
            imgEls.forEach((img, idx) => {
                // アップロードに成功した場合は新URL、失敗した場合は元URLを維持してmicroCMSの自動取得に賭ける
                if (uploadedBodyImages[idx]) {
                    $(img).attr('src', uploadedBodyImages[idx]);
                } else {
                    let src = $(img).attr('src') || $(img).attr('data-src');
                    if (src && src.startsWith('//')) src = 'https:' + src;
                    $(img).attr('src', src);
                }
                $(img).removeAttr('data-src').removeAttr('srcset');
            });

            // ペイロード作成
            const payload = {
                title: item.title,
                content: $content.html(),
                category_new: ["PRtimes"],
                publishedAt: item.pubDate,
                // アップロード成功URLか、失敗時はPR Timesの元URL（microCMSのインポート機能を期待）
                eyecatch: uploadedEyecatchUrl || ogImage
            };

            await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
                headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
            });
            console.log(`Successfully synced: ${item.title}`);
        }

        return res.status(200).json({ success: true, synced: newItems.length });
    } catch (error) {
        console.error('Sync Error:', error.response?.data || error.message);
        return res.status(500).json({ error: error.message });
    }
}