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
    type, // 'document_request' | 'recruit_entry' | undefined
    documentFiles, // Array of filenames for documents
    // --- 採用エントリー(recruit_entry)用フィールド ---
    desiredJob,      // 応募職種
    employmentType,  // 希望雇用形態
    furigana,        // ふりがな
    phone,           // 電話番号
    birthdate,       // 生年月日
    address,         // 住所
    skills,          // 保有スキル・経験
    motivation,      // 志望動機・自己PR
    portfolio,       // ポートフォリオURL / SNS
    referralSource,  // 知ったきっかけ
    files            // [{ filename, content(base64) }] 履歴書・職務経歴書
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
  const isRecruitEntry = type === 'recruit_entry';
  const siteUrl = 'https://meta-heroes.co.jp';

  // SSRF対策: 添付PDFの取得元は信頼できるホストのみに限定する。
  // 添付内容は請求者宛メールに添付されるため、クライアントが任意URLを指定できると
  // 内部エンドポイント等の内容を窃取される恐れがある。ホストを完全一致でホワイトリスト化する。
  const ALLOWED_FILE_HOSTS = new Set([
    'meta-heroes.co.jp',         // 自社サイト（public/assets配下の従来資料）
    'files.microcms-assets.io',  // microCMS ファイルアセット
    'images.microcms-assets.io', // microCMS 画像アセット
  ]);

  // 相対パス(/assets/...)は自社サイト基準で絶対URL化。
  // https かつ許可ホストのみ通し、それ以外は null（取得をブロック）。
  const resolveAllowedFileUrl = (rawUrl) => {
    try {
      const u = new URL(rawUrl, siteUrl); // 相対なら siteUrl 起点で解決（スペース/日本語も自動エンコード）
      if (u.protocol !== 'https:') return null;
      if (!ALLOWED_FILE_HOSTS.has(u.hostname)) return null;
      return u.toString();
    } catch {
      return null;
    }
  };

  // documentFiles は新形式 {name, url}（microCMS絶対URL or 相対パス） / 旧形式 文字列（ファイル名のみ） の両対応
  const normalizeFile = (file) => {
    if (typeof file === 'string') {
      // 旧形式: ファイル名のみ → 自社サイトpublic配下の相対パスへ
      return { name: file, rawUrl: `/assets/documents/${file}` };
    }
    // 新形式: { name, url } → ファイル名は表示用、URLは取得前に必ず検証する
    return { name: file.name, rawUrl: file.url };
  };

  // Fetch document files for attachment
  let attachments = [];
  if (isDocumentRequest && documentFiles && documentFiles.length > 0) {
    const fetchResults = await Promise.allSettled(
      documentFiles.map(async (file) => {
        const { name, rawUrl } = normalizeFile(file);
        const url = resolveAllowedFileUrl(rawUrl);
        if (!url) {
          throw new Error(`Blocked or invalid file URL for ${name}`);
        }
        // redirect: 'manual' でリダイレクト経由のSSRF回避
        const response = await fetch(url, { redirect: 'manual' });
        if (!response.ok) throw new Error(`Failed to fetch ${name}: ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        return { filename: name, content: buffer };
      })
    );
    attachments = fetchResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const failed = fetchResults.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.warn('Some attachments failed to fetch:', failed.map(r => r.reason.message));
    }
  }

  // 採用エントリー: クライアントから送られたbase64ファイル(履歴書・職務経歴書)を添付に変換
  if (isRecruitEntry && Array.isArray(files) && files.length > 0) {
    attachments = files
      .filter(f => f && f.filename && f.content)
      .map(f => ({
        filename: f.filename,
        content: f.content,
        encoding: 'base64',
      }));
  }

  const categoryLabels = {
    business: '事業に関するお問い合わせ',
    service: 'サービスに関するお問い合わせ',
    partner: 'パートナーシップ・協業について',
    recruit: '採用に関するお問い合わせ',
    press: '取材・プレスに関するお問い合わせ',
    speaking: '講演・登壇依頼',
    other: 'その他'
  };

  const categoryLabel = isDocumentRequest
    ? 'お役立ち資料'
    : isRecruitEntry
      ? '採用エントリー'
      : (categoryLabels[category] || category);

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

  // 管理者宛メール本文（採用エントリーは専用フォーマット）
  let adminText;
  if (isRecruitEntry) {
    adminText = `
ウェブサイトから採用エントリーがありました。

【応募職種】: ${desiredJob || '---'}
【希望雇用形態】: ${employmentType || '---'}
【お名前】: ${name}
【ふりがな】: ${furigana || '---'}
【メールアドレス】: ${email}
【電話番号】: ${phone || '---'}
【生年月日】: ${birthdate || '---'}
【住所】: ${address || '---'}
【ポートフォリオURL / SNS】: ${portfolio || '---'}
【知ったきっかけ】: ${referralSource || '---'}

【保有スキル・経験】:
${skills || '---'}

【志望動機・自己PR】:
${motivation || '---'}

【添付書類】: ${attachments.length > 0 ? attachments.map(a => a.filename).join(' / ') : 'なし'}
    `;
  } else {
    adminText = `
ウェブサイトから${categoryLabel}がありました。

【項目】: ${categoryLabel}
【会社名】: ${company || '---'}
【部署・役職】: ${department || '---'}
【お名前】: ${name}
【メールアドレス】: ${email}
【職業・所属】: ${occupation || '---'}

【内容】:
${content}
    `;
  }

  try {
    // 1. Send to Admin
    await transporter.sendMail({
      from: `"MetaHeroes Website" <${user}>`,
      to: 'contact@meta-heroes.io',
      replyTo: email,
      subject: `【${categoryLabel}】${name}様`,
      text: adminText,
      // 採用エントリーの履歴書・職務経歴書は採用担当(管理者)宛に添付する
      ...(isRecruitEntry && attachments.length > 0 && { attachments }),
    });

    // 2. Send Auto-reply to User
    let autoReplyText = '';
    if (isDocumentRequest && documentFiles && documentFiles.length > 0) {
      const fileList = documentFiles.map(file => `・${normalizeFile(file).name}`).join('\n');

      autoReplyText = `
${name} 様

この度はお役立ち資料のご請求をいただき、誠にありがとうございます。
ご請求いただいた資料を本メールに添付しておりますので、ご確認ください。

【添付資料】
${fileList}

内容についてご不明な点や、より詳細な説明が必要な場合は、
本メールへの返信、またはお問い合わせフォームよりお気軽にご連絡ください。

--------------------------------------------------
【ご請求内容】

お名前: ${name}
会社名: ${company || '---'}
--------------------------------------------------

株式会社MetaHeroes
URL: https://meta-heroes.co.jp/
      `;
    } else if (isRecruitEntry) {
      autoReplyText = `
${name} 様

この度は株式会社MetaHeroesへエントリーいただき、誠にありがとうございます。
以下の内容でエントリーを承りました。

内容を確認の上、採用担当者より追ってご連絡させていただきます。
今しばらくお待ちいただけますようお願い申し上げます。

--------------------------------------------------
【エントリー内容】

応募職種: ${desiredJob || '---'}
希望雇用形態: ${employmentType || '---'}
お名前: ${name}（${furigana || '---'}）
メールアドレス: ${email}
電話番号: ${phone || '---'}
生年月日: ${birthdate || '---'}
住所: ${address || '---'}
添付書類: ${attachments.length > 0 ? attachments.map(a => a.filename).join(' / ') : 'なし'}
--------------------------------------------------

※本メールは自動返信です。心当たりのない場合は破棄してください。

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

    const replySubject = isDocumentRequest
      ? 'お役立ち資料'
      : isRecruitEntry
        ? '採用エントリー'
        : 'お問い合わせ';

    await transporter.sendMail({
      from: `"株式会社MetaHeroes" <${user}>`,
      to: email,
      subject: `【株式会社MetaHeroes】${replySubject}ありがとうございます`,
      text: autoReplyText,
      // 資料請求 / 採用エントリーは応募者にも控えとして添付する
      ...((isDocumentRequest || isRecruitEntry) && attachments.length > 0 && { attachments }),
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
