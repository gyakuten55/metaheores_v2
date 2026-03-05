const handler = require('./api/sync.js');

// Vercelのreq, resをシミュレート
const req = {
    headers: {
        'authorization': 'Bearer metaheroes_prtimes16'
    }
};

const res = {
    status: (code) => {
        console.log(`HTTP Status: ${code}`);
        return res;
    },
    json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
        return res;
    }
};

// 環境変数を設定
process.env.CRON_SECRET = 'metaheroes_prtimes16';

console.log('Starting manual sync test...');
handler(req, res).then(() => {
    console.log('Manual sync test finished.');
}).catch(err => {
    console.error('Manual sync test failed:', err);
});
