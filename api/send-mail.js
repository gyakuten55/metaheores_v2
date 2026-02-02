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
    content 
  } = req.body;

  const categoryLabels = {
    business: '事業に関するお問い合わせ',
    service: 'サービスに関するお問い合わせ',
    partner: 'パートナーシップ・協業について',
    recruit: '採用に関するお問い合わせ',
    press: '取材・プレスに関するお問い合わせ',
    other: 'その他'
  };

  const categoryLabel = categoryLabels[category] || category;

  // Validation
  if (!name || !email || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SMTP Settings (Heteml)
  const host = (process.env.SMTP_HOST || 'smtp.heteml.jp').trim();
  const port = parseInt((process.env.SMTP_PORT || '465').trim());
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, 
    auth: {
      user: user,
      pass: pass,
    },
    // SSLの証明書エラーを回避するためのオプション（念のため）
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection configuration
    await transporter.verify();

    // 1. Send to Admin
    await transporter.sendMail({
      from: `"MetaHeroes Website" <${user}>`,
      to: 'contact@meta-heroes.io',
      replyTo: email,
      subject: `【お問い合わせ】${categoryLabel} - ${name}様`,
      text: `
ウェブサイトから新しいお問い合わせがありました。

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
    await transporter.sendMail({
      from: `"株式会社MetaHeroes" <${user}>`,
      to: email,
      subject: `【株式会社MetaHeroes】お問い合わせありがとうございます`,
      text: `
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
      `,
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
