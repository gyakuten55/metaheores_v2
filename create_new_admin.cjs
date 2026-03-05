const { createClient } = require('@supabase/supabase-js');

// 接続情報（手動で設定するか、.envから読み込んでください）
const supabaseUrl = 'https://vtwwmgltkwnlgjqojtcu.supabase.co';
const supabaseKey = 'YOUR_SERVICE_ROLE_KEY'; // ※管理者権限が必要なため、Service Role Keyが必要です

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'admin@meta-heroes.co.jp'; // 新しいアドレス
  const password = 'MetaAdmin2026!'; // 仮パスワード

  console.log(`Creating user: ${email}...`);

  // 1. Authユーザー作成
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log(`User created successfully. ID: ${userId}`);

  // 2. Profilesテーブルにadmin権限で登録
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: 'Administrator',
      company_name: 'MetaHeroes',
      role: 'admin'
    });

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
  } else {
    console.log('Admin profile created successfully!');
  }
}

// 注意: このスクリプトを実行するには Service Role Key が必要です。
// createAdmin();
