import axios from 'axios';
import * as cheerio from 'cheerio';

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi';
const MICROCMS_ENDPOINT = 'news';
const PR_TIMES_COMPANY_ID = '94539';

export default async function handler(req, res) {
    // セキュリティチェック
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('Fetching existing news from microCMS...');
        const resList = await axios.get(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, {
            headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
            params: { limit: 10, fields: 'title' }
        });
        const existingTitles = new Set(resList.data.contents.map(c => c.title));

        console.log('Fetching PR Times RSS...');
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

        // 2026-01-29以降かつ未登録の記事を1件ずつ処理（タイムアウト回避のため）
        const filterDate = new Date('2026-01-29T00:00:00+09:00');
        const newItems = items.filter(item => {
            const d = new Date(item.pubDate);
            return d >= filterDate && !existingTitles.has(item.title);
        });

        console.log(`Found ${newItems.length} new items to sync.`);

        for (const item of newItems) {
            console.log(`Processing article: ${item.title}`);
            const { data: html } = await axios.get(item.link);
            const $ = cheerio.load(html);
            
            // アイキャッチURL（パラメータなしの綺麗なURLを取得）
            let ogImage = $('meta[property="og:image"]').attr('content');
            if (ogImage) ogImage = ogImage.split('?')[0];

            // 本文抽出
            let $content = $('.press-release-body-v3-0-0');
            if ($content.length === 0) $content = $('.release-body');
            
            $content.find('script, style, iframe, .social-buttons').remove();

            // 本文内の画像を microCMS 形式に整形
            $content.find('img').each((i, el) => {
                let src = $(el).attr('src') || $(el).attr('data-src');
                if (src && src.startsWith('//')) src = 'https:' + src;
                if (src) src = src.split('?')[0];
                
                // タグをクリーンにする
                const newImg = `<img src="${src}" alt="" />`;
                $(el).replaceWith(newImg);
            });

            // 投稿用データ
            // 以前の調査で eyecatch: "URL文字列" で成功していたので、その形式を維持しつつ
            // microCMSの自動インポートを誘発させます。
            const payload = {
                title: item.title,
                content: $content.html(),
                category_new: ["PRtimes"],
                publishedAt: item.pubDate,
                eyecatch: ogImage // URLを直接送信
            };

            await axios.post(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, payload, {
                headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
            });
            console.log(`Successfully synced: ${item.title}`);
        }

        return res.status(200).json({ success: true, synced: newItems.length });
    } catch (error) {
        console.error('Sync error:', error.response?.data || error.message);
        return res.status(500).json({ error: error.message, details: error.response?.data });
    }
}
