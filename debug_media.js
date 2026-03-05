import axios from 'axios';

const MICROCMS_SERVICE_DOMAIN = 'g07uki3u26';
const MICROCMS_API_KEY = 'apdNtrwXnGxRIg7IgDTmfRsgn6YYfg8J2RFt';

async function testUpload() {
    const imageUrl = 'https://prcdn.freetls.fastly.net/release_image/94539/295/94539-295-6fd2cd4294ccaea231338599277ea16d-3900x2925.jpg';
    console.log(`Testing upload for: ${imageUrl}`);
    
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('file', blob, 'test_image.jpg');

        const uploadRes = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/media`, {
            method: 'POST',
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY
            },
            body: formData
        });

        const status = uploadRes.status;
        const text = await uploadRes.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

testUpload();
