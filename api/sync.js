import axios from 'axios';
import * as cheerio from 'cheerio';

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';
const MICROCMS_ENDPOINT = 'news';
const PR_TIMES_COMPANY_ID = '94539';

async function uploadToMicroCMSMedia(imageUrl) {
    if (!imageUrl) return null;
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;
        const buffer = await response.arrayBuffer();
        const fileName = `pr_${Date.now()}.jpg`;
        const formData = new FormData();
        const blob = new Blob([buffer], { type: response.headers.get('content-type') || 'image/jpeg' });
        formData.append('file', blob, fileName);

        const uploadRes = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/media`, {
            method: 'POST',
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            body: formData
        });
        if (!uploadRes.ok) return null;
        const data = await uploadRes.json();
        return data.url;
    } catch (e) {
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
            const { data: html } = await axios.get(item.link);
            const $ = cheerio.load(html);
            const ogImage = $('meta[property="og:image"]').attr('content');
            
            let $content = $('.press-release-body-v3-0-0');
            if ($content.length === 0) $content = $('.release-body');
            $content.find('script, style, iframe').remove();

            const imgEls = $content.find('img').get();
            const imageUrls = imgEls.map(img => {
                let src = $(img).attr('src') || $(img).attr('data-src');
                if (src && src.startsWith('//')) src = 'https:' + src;
                return src;
            });

            // 画像のアップロード
            const [eyecatchUrl, ...mediaUrls] = await Promise.all([
                uploadToMicroCMSMedia(ogImage),
                ...imageUrls.map(url => uploadToMicroCMSMedia(url))
            ]);

            // 本文置換
            imgEls.forEach((img, idx) => {
                if (mediaUrls[idx]) {
                    $(img).replaceWith(`<img src="${mediaUrls[idx]}" alt="" />`);
                } else {
                    $(img).remove();
                }
            });

            const payload = {
                title: item.title,
                content: $content.html(),
                category_new: ["PRtimes"],
                publishedAt: item.pubDate,
                eyecatch: eyecatchUrl // 特定した正解形式：URL文字列
            };

            await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
                headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
            });
        }

        return res.status(200).json({ success: true, synced: newItems.length });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}