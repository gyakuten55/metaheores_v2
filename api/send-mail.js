import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    category, 
    company, 
    department, 
    name, 
    email, 
    occupation, 
    content,
    confirm_email_field, // Honeypot
    _t, // Timestamp
    type, // 'document_request' or undefined
    documentFiles // Array of filenames for documents
  } = req.body;

  // 1. Honeypot check: If filled, it's a bot
  if (confirm_email_field) {
    console.warn('Spam detected: Honeypot filled');
    return res.status(200).json({ success: true, message: 'Spam filtered' }); // Return success to fool the bot
  }

  // 2. Referer check: Prevent external API calls
  const referer = req.headers.referer || '';
  const allowedDomains = ['meta-heroes.co.jp', 'localhost', 'vercel.app'];
  const isAllowed = allowedDomains.some(domain => referer.includes(domain));
  
  if (!isAllowed) {
    console.warn(`Unauthorized referer: ${referer}`);
    return res.status(403).json({ error: 'Access denied' });
  }

  const isDocumentRequest = type === 'document_request';
  const siteUrl = 'https://meta-heroes.co.jp';

  const categoryLabels = {
    business: '事業に関するお問い合わせ',
    service: 'サービスに関するお問い合わせ',
    partner: 'パートナーシップ・協業について',
    recruit: '採用に関するお問い合わせ',
    press: '取材・プレスに関するお問い合わせ',
    other: 'その他'
  };

  const categoryLabel = isDocumentRequest ? '資料請求' : (categoryLabels[category] || category);

  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SMTP Settings (Heteml/Hetemail)
  const host = (process.env.SMTP_HOST || 'smtp.hetemail.jp').replace(/\s+/g, '');
  const port = parseInt((process.env.SMTP_PORT || '587').replace(/\s+/g, ''));
  const user = (process.env.SMTP_USER || '').replace(/\s+/g, '');
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) {
    return res.status(500).json({ error: 'Server configuration error: Missing credentials' });
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user: user,
      pass: pass,
    },
    // 一部のサーバーで必要な認証方式の明示
    authMethod: 'LOGIN',
    tls: {
      // 接続先サーバー名が証明書と一致しない場合のエラー回避
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    debug: true,
    logger: true
  });

  try {
    // 1. Send to Admin
    await transporter.sendMail({
      from: `"MetaHeroes Website" <${user}>`,
      to: 'contact@meta-heroes.io',
      replyTo: email,
      subject: `【${categoryLabel}】${name}様`,
      text: `
ウェブサイトから${categoryLabel}がありました。

【項目】: ${categoryLabel}
【会社名】: ${company || '---'}
【部署・役職】: ${department || '---'}
【お名前】: ${name}
【メールアドレス】: ${email}
【職業・所属】: ${occupation || '---'}

【内容】:
${content}
      `,
    });

    // 2. Send Auto-reply to User
    let autoReplyText = '';
    if (isDocumentRequest && documentFiles && documentFiles.length > 0) {
      const links = documentFiles.map(file => {
        // Encode URI because filenames have Japanese/spaces
        return `${siteUrl}/assets/documents/${encodeURIComponent(file)}`;
      }).join('\n');

      autoReplyText = `
${name} 様

この度は資料請求をいただき、誠にありがとうございます。
ご請求いただいた資料のダウンロードURLをお送りいたします。

以下のURLより資料をダウンロードいただけます：

${links}

※ダウンロード期限はございませんが、お早めにご確認ください。
また、内容についてご不明な点や、より詳細な説明が必要な場合は、
本メールへの返信、またはお問い合わせフォームよりお気軽にご連絡ください。

--------------------------------------------------
【ご請求内容】

お名前: ${name}
会社名: ${company || '---'}
--------------------------------------------------

株式会社MetaHeroes
URL: https://meta-heroes.co.jp/
      `;
    } else {
      autoReplyText = `
${name} 様

この度はお問い合わせいただき、誠にありがとうございます。
以下の内容で送信を承りました。

内容を確認の上、担当者より折り返しご連絡させていただきます。
今しばらくお待ちいただけますようお願い申し上げます。

--------------------------------------------------
【お問い合わせ内容】

項目: ${categoryLabel}
会社名: ${company || '---'}
お名前: ${name}
内容:
${content}
--------------------------------------------------

※本メールは自動返信です。心当たりのない場合は破棄してください。

株式会社MetaHeroes
URL: https://meta-heroes.co.jp/
      `;
    }

    await transporter.sendMail({
      from: `"株式会社MetaHeroes" <${user}>`,
      to: email,
      subject: `【株式会社MetaHeroes】${isDocumentRequest ? '資料請求' : 'お問い合わせ'}ありがとうございます`,
      text: autoReplyText,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail send error detailed:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message,
      code: error.code
    });
  }
}
