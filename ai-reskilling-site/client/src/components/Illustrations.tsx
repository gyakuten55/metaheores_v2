import React from "react";
/**
 * Illustrations.tsx — 5種類のSVGイラストコンポーネント
 * デフォルメされた日本人向け・親しみやすいタッチ
 * Dark Navy × Pink/Purple パレットに合わせたカラーリング
 */

// ── 1. 成果カード用イラスト（6種類） ──────────────────────────────────────────

// 時間を取り戻す — 人物がPCで作業、時計が軽くなる
export function IllustTime({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 背景円 */}
      <circle cx="40" cy="40" r="38" fill="#EEF2FF" />
      {/* 時計 */}
      <circle cx="40" cy="38" r="18" fill="white" stroke="#172554" strokeWidth="2.5"/>
      <line x1="40" y1="38" x2="40" y2="26" stroke="#172554" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="38" x2="50" y2="38" stroke="#A3377B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="38" r="2" fill="#172554"/>
      {/* 人物 */}
      <circle cx="22" cy="58" r="5" fill="#FFD6A5"/>
      <rect x="17" y="63" width="10" height="10" rx="3" fill="#172554"/>
      {/* PC */}
      <rect x="28" y="60" width="18" height="12" rx="2" fill="#172554"/>
      <rect x="30" y="62" width="14" height="8" rx="1" fill="#A3377B" fillOpacity="0.3"/>
      <rect x="32" y="72" width="10" height="2" rx="1" fill="#172554"/>
      {/* 星（軽さ） */}
      <circle cx="62" cy="25" r="3" fill="#e879b8" fillOpacity="0.7"/>
      <circle cx="68" cy="35" r="2" fill="#A3377B" fillOpacity="0.5"/>
    </svg>
  );
}

// 外注を内製化する — 人物がAIと一緒に制作
export function IllustInhouse({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FDF2F8"/>
      {/* 人物 */}
      <circle cx="28" cy="30" r="6" fill="#FFD6A5"/>
      <rect x="22" y="36" width="12" height="14" rx="3" fill="#172554"/>
      {/* AI バッジ */}
      <rect x="38" y="28" width="20" height="14" rx="4" fill="#A3377B"/>
      <text x="48" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">AI</text>
      {/* 矢印 */}
      <path d="M34 36 L38 34" stroke="#e879b8" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrow)"/>
      {/* 成果物 */}
      <rect x="42" y="48" width="18" height="22" rx="2" fill="white" stroke="#172554" strokeWidth="1.5"/>
      <line x1="45" y1="54" x2="57" y2="54" stroke="#A3377B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="45" y1="58" x2="57" y2="58" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="45" y1="62" x2="53" y2="62" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      {/* チェック */}
      <circle cx="20" cy="62" r="6" fill="#172554"/>
      <path d="M17 62 L19 64 L23 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ミスと抜け漏れを減らす — チェックリストとAI
export function IllustCheck({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#EEF2FF"/>
      {/* クリップボード */}
      <rect x="18" y="22" width="30" height="38" rx="3" fill="white" stroke="#172554" strokeWidth="2"/>
      <rect x="28" y="18" width="10" height="8" rx="2" fill="#172554"/>
      {/* チェック項目 */}
      <circle cx="25" cy="34" r="3" fill="#172554"/>
      <path d="M23.5 34 L24.5 35 L26.5 33" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="30" y1="34" x2="44" y2="34" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="25" cy="42" r="3" fill="#172554"/>
      <path d="M23.5 42 L24.5 43 L26.5 41" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="30" y1="42" x2="44" y2="42" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="25" cy="50" r="3" fill="#A3377B" fillOpacity="0.3"/>
      <line x1="30" y1="50" x2="44" y2="50" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      {/* AI ルーペ */}
      <circle cx="56" cy="52" r="12" fill="#A3377B" fillOpacity="0.15" stroke="#A3377B" strokeWidth="2"/>
      <text x="56" y="56" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A3377B">AI</text>
      <line x1="64" y1="60" x2="70" y2="66" stroke="#172554" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// 属人業務を標準化する — ナレッジ共有
export function IllustStandard({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#EEF2FF"/>
      {/* 人物3人 */}
      <circle cx="20" cy="30" r="5" fill="#FFD6A5"/>
      <rect x="15" y="35" width="10" height="10" rx="2" fill="#172554"/>
      <circle cx="40" cy="26" r="5" fill="#FFD6A5"/>
      <rect x="35" y="31" width="10" height="10" rx="2" fill="#A3377B"/>
      <circle cx="60" cy="30" r="5" fill="#FFD6A5"/>
      <rect x="55" y="35" width="10" height="10" rx="2" fill="#172554"/>
      {/* 矢印 */}
      <path d="M25 38 L35 34" stroke="#e879b8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M45 34 L55 38" stroke="#e879b8" strokeWidth="1.5" strokeLinecap="round"/>
      {/* マニュアル */}
      <rect x="26" y="52" width="28" height="18" rx="3" fill="white" stroke="#172554" strokeWidth="1.5"/>
      <line x1="30" y1="58" x2="50" y2="58" stroke="#A3377B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="62" x2="50" y2="62" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="66" x2="44" y2="66" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// 提案・販売力を高める — グラフと人物
export function IllustSales({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FDF2F8"/>
      {/* グラフ */}
      <rect x="14" y="20" width="40" height="30" rx="3" fill="white" stroke="#172554" strokeWidth="1.5"/>
      <polyline points="18,44 26,36 34,38 42,28 50,24" stroke="#A3377B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="50" cy="24" r="3" fill="#e879b8"/>
      {/* 上矢印 */}
      <path d="M56 32 L62 24 L68 32" stroke="#172554" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="62" y1="24" x2="62" y2="44" stroke="#172554" strokeWidth="2" strokeLinecap="round"/>
      {/* 人物 */}
      <circle cx="24" cy="62" r="5" fill="#FFD6A5"/>
      <rect x="19" y="67" width="10" height="8" rx="2" fill="#172554"/>
      {/* 提案書 */}
      <rect x="34" y="58" width="16" height="20" rx="2" fill="white" stroke="#A3377B" strokeWidth="1.5"/>
      <line x1="37" y1="64" x2="47" y2="64" stroke="#A3377B" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="37" y1="68" x2="47" y2="68" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

// 社員が自ら改善する — 上向き矢印と人物
export function IllustGrowth({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#EEF2FF"/>
      {/* 人物 */}
      <circle cx="40" cy="28" r="7" fill="#FFD6A5"/>
      <rect x="33" y="35" width="14" height="16" rx="3" fill="#172554"/>
      {/* 上矢印（大） */}
      <path d="M40 58 L40 72" stroke="#A3377B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 65 L40 58 L47 65" stroke="#A3377B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* 星 */}
      <circle cx="60" cy="30" r="4" fill="#e879b8" fillOpacity="0.8"/>
      <circle cx="18" cy="50" r="3" fill="#A3377B" fillOpacity="0.5"/>
      <circle cx="64" cy="52" r="2" fill="#e879b8" fillOpacity="0.6"/>
    </svg>
  );
}

// ── 2. 課題カード用イラスト（3種類） ──────────────────────────────────────────

// 時間が足りない — 人物が頭を抱えている、タスクが山積み
export function IllustPainTime({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" fill="#FFF7ED"/>
      {/* 人物 */}
      <circle cx="60" cy="38" r="10" fill="#FFD6A5"/>
      {/* 頭を抱えるポーズ */}
      <path d="M48 38 C44 34 44 28 50 30" stroke="#FFD6A5" strokeWidth="4" strokeLinecap="round"/>
      <path d="M72 38 C76 34 76 28 70 30" stroke="#FFD6A5" strokeWidth="4" strokeLinecap="round"/>
      <rect x="50" y="48" width="20" height="22" rx="4" fill="#172554"/>
      {/* 書類の山 */}
      <rect x="20" y="72" width="22" height="4" rx="1" fill="#D9E0EA" transform="rotate(-5 20 72)"/>
      <rect x="22" y="68" width="22" height="4" rx="1" fill="#E2E8F0" transform="rotate(-3 22 68)"/>
      <rect x="21" y="64" width="22" height="4" rx="1" fill="#CBD5E1" transform="rotate(-7 21 64)"/>
      {/* 時計 */}
      <circle cx="90" cy="55" r="16" fill="white" stroke="#172554" strokeWidth="2"/>
      <line x1="90" y1="55" x2="90" y2="45" stroke="#172554" strokeWidth="2" strokeLinecap="round"/>
      <line x1="90" y1="55" x2="98" y2="55" stroke="#A3377B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="90" cy="55" r="2.5" fill="#172554"/>
      {/* 焦りの汗 */}
      <ellipse cx="50" cy="32" rx="2" ry="3" fill="#93C5FD" fillOpacity="0.7" transform="rotate(-20 50 32)"/>
      <ellipse cx="72" cy="30" rx="1.5" ry="2.5" fill="#93C5FD" fillOpacity="0.7" transform="rotate(15 72 30)"/>
      {/* ！マーク */}
      <circle cx="40" cy="88" r="12" fill="#FEF3C7"/>
      <text x="40" y="93" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#D97706">!</text>
    </svg>
  );
}

// 人に依存している — ベテランと若手、?マーク
export function IllustPainDepend({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" fill="#F0F9FF"/>
      {/* ベテラン（左） */}
      <circle cx="35" cy="40" r="10" fill="#FFD6A5"/>
      <rect x="25" y="50" width="20" height="22" rx="4" fill="#172554"/>
      {/* 知識バブル */}
      <ellipse cx="35" cy="25" rx="16" ry="10" fill="#172554" fillOpacity="0.9"/>
      <text x="35" y="29" textAnchor="middle" fontSize="8" fill="white">ノウハウ</text>
      {/* 若手（右） */}
      <circle cx="85" cy="40" r="10" fill="#FFD6A5"/>
      <rect x="75" y="50" width="20" height="22" rx="4" fill="#64748B"/>
      {/* ?マーク */}
      <circle cx="85" cy="25" r="12" fill="#FEF3C7"/>
      <text x="85" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#D97706">?</text>
      {/* 矢印（一方向） */}
      <path d="M45 52 L75 52" stroke="#D9E0EA" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round"/>
      <path d="M70 49 L75 52 L70 55" fill="#D9E0EA"/>
      {/* 鎖 */}
      <circle cx="60" cy="82" r="10" fill="#FEE2E2"/>
      <path d="M55 82 C55 78 65 78 65 82 C65 86 55 86 55 82" stroke="#EF4444" strokeWidth="2" fill="none"/>
      <line x1="60" y1="72" x2="60" y2="78" stroke="#EF4444" strokeWidth="2"/>
      <line x1="60" y1="86" x2="60" y2="92" stroke="#EF4444" strokeWidth="2"/>
    </svg>
  );
}

// 外注し続けている — お金が外に流れる
export function IllustPainOutsource({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" fill="#FFF1F2"/>
      {/* 会社（左） */}
      <rect x="10" y="50" width="30" height="35" rx="3" fill="#172554"/>
      <rect x="15" y="55" width="8" height="8" rx="1" fill="white" fillOpacity="0.3"/>
      <rect x="27" y="55" width="8" height="8" rx="1" fill="white" fillOpacity="0.3"/>
      <rect x="18" y="68" width="14" height="17" rx="1" fill="white" fillOpacity="0.2"/>
      {/* 外注先（右） */}
      <rect x="80" y="50" width="30" height="35" rx="3" fill="#64748B"/>
      <rect x="85" y="55" width="8" height="8" rx="1" fill="white" fillOpacity="0.3"/>
      <rect x="97" y="55" width="8" height="8" rx="1" fill="white" fillOpacity="0.3"/>
      {/* お金の流れ */}
      <path d="M40 62 Q60 50 80 62" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M75 59 L80 62 L77 67" fill="#EF4444"/>
      {/* 円マーク */}
      <circle cx="60" cy="42" r="12" fill="#FEF3C7"/>
      <text x="60" y="47" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#D97706">¥</text>
      {/* ノウハウが残らない */}
      <path d="M40 78 Q60 90 80 78" stroke="#D9E0EA" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" fill="none"/>
      <text x="60" y="100" textAnchor="middle" fontSize="8" fill="#94A3B8">ノウハウ蓄積なし</text>
    </svg>
  );
}

// ── 3. Before/After 用イラスト ──────────────────────────────────────────────

// Before: 書類に追われる営業担当
export function IllustBeforeSales({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="12" fill="#FFF7ED"/>
      {/* 人物 */}
      <circle cx="50" cy="45" r="12" fill="#FFD6A5"/>
      <rect x="38" y="57" width="24" height="28" rx="4" fill="#172554"/>
      {/* 書類の山 */}
      <rect x="70" y="40" width="30" height="4" rx="1" fill="#E2E8F0" transform="rotate(-8 70 40)"/>
      <rect x="72" y="46" width="30" height="4" rx="1" fill="#CBD5E1" transform="rotate(-4 72 46)"/>
      <rect x="68" y="52" width="30" height="4" rx="1" fill="#D9E0EA" transform="rotate(-10 68 52)"/>
      <rect x="74" y="58" width="30" height="4" rx="1" fill="#E2E8F0" transform="rotate(-2 74 58)"/>
      {/* 焦り */}
      <ellipse cx="38" cy="38" rx="3" ry="4" fill="#93C5FD" fillOpacity="0.8" transform="rotate(-20 38 38)"/>
      <ellipse cx="62" cy="36" rx="2" ry="3" fill="#93C5FD" fillOpacity="0.8" transform="rotate(15 62 36)"/>
      {/* ！ */}
      <circle cx="100" cy="75" r="14" fill="#FEE2E2"/>
      <text x="100" y="81" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#EF4444">!</text>
      {/* BEFORE ラベル */}
      <rect x="10" y="100" width="60" height="22" rx="4" fill="#172554"/>
      <text x="40" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">BEFORE</text>
    </svg>
  );
}

// After: 提案に集中する営業担当
export function IllustAfterSales({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="12" fill="#F0FDF4"/>
      {/* 人物（笑顔） */}
      <circle cx="50" cy="45" r="12" fill="#FFD6A5"/>
      <path d="M44 47 Q50 52 56 47" stroke="#172554" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <rect x="38" y="57" width="24" height="28" rx="4" fill="#172554"/>
      {/* AI が処理 */}
      <rect x="70" y="35" width="50" height="35" rx="6" fill="#A3377B" fillOpacity="0.15" stroke="#A3377B" strokeWidth="1.5"/>
      <text x="95" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#A3377B">AI</text>
      <line x1="75" y1="58" x2="115" y2="58" stroke="#A3377B" strokeWidth="1" strokeDasharray="3 2"/>
      <text x="95" y="67" textAnchor="middle" fontSize="8" fill="#A3377B">初稿・整理を自動化</text>
      {/* 矢印 */}
      <path d="M62 62 L70 58" stroke="#e879b8" strokeWidth="2" strokeLinecap="round"/>
      {/* グラフ（成果） */}
      <polyline points="75,110 85,100 95,102 105,90 115,82" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="115" cy="82" r="4" fill="#22C55E"/>
      {/* AFTER ラベル */}
      <rect x="10" y="100" width="55" height="22" rx="4" fill="#A3377B"/>
      <text x="37" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">AFTER</text>
    </svg>
  );
}

// ── 4. 5STEP 用イラスト（ステップごとに変化） ──────────────────────────────────

export function IllustStep({ step, size = 160 }: { step: number; size?: number }) {
  const configs = [
    // STEP 01: 業務を整理する
    {
      bg: "#EEF2FF",
      content: (
        <>
          <rect x="30" y="30" width="80" height="80" rx="8" fill="white" stroke="#172554" strokeWidth="2"/>
          <line x1="40" y1="50" x2="100" y2="50" stroke="#D9E0EA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="40" y1="60" x2="100" y2="60" stroke="#D9E0EA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="40" y1="70" x2="80" y2="70" stroke="#A3377B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="40" y1="80" x2="90" y2="80" stroke="#D9E0EA" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="120" cy="40" r="14" fill="#FFD6A5"/>
          <rect x="110" y="54" width="20" height="24" rx="4" fill="#172554"/>
          <path d="M108 44 L110 46 L114 42" stroke="#172554" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )
    },
    // STEP 02: AIを使う仕事を決める
    {
      bg: "#FDF2F8",
      content: (
        <>
          <circle cx="80" cy="65" r="30" fill="#A3377B" fillOpacity="0.1" stroke="#A3377B" strokeWidth="2"/>
          <text x="80" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#A3377B">AI</text>
          <text x="80" y="76" textAnchor="middle" fontSize="8" fill="#A3377B">活用候補</text>
          <circle cx="30" cy="50" r="8" fill="#FFD6A5"/>
          <rect x="22" y="58" width="16" height="18" rx="3" fill="#172554"/>
          <path d="M38 56 L50 58" stroke="#e879b8" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="130" cy="50" r="8" fill="#FFD6A5"/>
          <rect x="122" y="58" width="16" height="18" rx="3" fill="#64748B"/>
          <path d="M122 56 L110 58" stroke="#D9E0EA" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="80" cy="110" r="8" fill="#FFD6A5"/>
          <rect x="72" y="118" width="16" height="18" rx="3" fill="#172554"/>
          <path d="M80 102 L80 95" stroke="#e879b8" strokeWidth="2" strokeLinecap="round"/>
        </>
      )
    },
    // STEP 03: 実際にAIを使う
    {
      bg: "#EEF2FF",
      content: (
        <>
          <circle cx="80" cy="60" r="14" fill="#FFD6A5"/>
          <rect x="66" y="74" width="28" height="30" rx="4" fill="#172554"/>
          <rect x="30" y="50" width="28" height="36" rx="4" fill="#172554"/>
          <rect x="32" y="52" width="24" height="28" rx="2" fill="#A3377B" fillOpacity="0.3"/>
          <text x="44" y="70" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#e879b8">AI</text>
          <path d="M58 62 L66 66" stroke="#e879b8" strokeWidth="2" strokeLinecap="round"/>
          <rect x="100" y="55" width="28" height="30" rx="3" fill="white" stroke="#172554" strokeWidth="1.5"/>
          <line x1="104" y1="63" x2="124" y2="63" stroke="#A3377B" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="104" y1="68" x2="124" y2="68" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="104" y1="73" x2="118" y2="73" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M94 66 L100 66" stroke="#e879b8" strokeWidth="2" strokeLinecap="round"/>
        </>
      )
    },
    // STEP 04: 成果物をつくる
    {
      bg: "#FDF2F8",
      content: (
        <>
          <rect x="25" y="30" width="50" height="65" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
          <line x1="32" y1="45" x2="68" y2="45" stroke="#A3377B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="32" y1="53" x2="68" y2="53" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="32" y1="60" x2="68" y2="60" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="32" y1="67" x2="55" y2="67" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="32" y="75" width="36" height="12" rx="2" fill="#A3377B" fillOpacity="0.15"/>
          <text x="50" y="84" textAnchor="middle" fontSize="7" fill="#A3377B">提案書</text>
          <circle cx="110" cy="55" r="14" fill="#FFD6A5"/>
          <rect x="96" y="69" width="28" height="26" rx="4" fill="#172554"/>
          <path d="M104 62 Q110 67 116 62" stroke="#172554" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <circle cx="30" cy="110" r="10" fill="#22C55E" fillOpacity="0.2"/>
          <path d="M25 110 L28 113 L35 107" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )
    },
    // STEP 05: 改善を続ける
    {
      bg: "#EEF2FF",
      content: (
        <>
          <path d="M80 30 C110 30 130 55 120 80 C110 105 80 115 55 100 C30 85 25 55 45 38 C55 30 65 28 80 30" stroke="#A3377B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M75 25 L80 30 L75 35" fill="#A3377B"/>
          <circle cx="80" cy="70" r="14" fill="#FFD6A5"/>
          <rect x="66" y="84" width="28" height="24" rx="4" fill="#172554"/>
          <path d="M74 77 Q80 82 86 77" stroke="#172554" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <polyline points="30,110 45,95 60,100 75,85 90,75" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="90" cy="75" r="4" fill="#22C55E"/>
        </>
      )
    }
  ];
  const c = configs[Math.min(step, 4)];
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="160" rx="16" fill={c.bg}/>
      {c.content}
    </svg>
  );
}

// ── 5. 成果物コラージュ用 ──────────────────────────────────────────────────────

export function IllustDeliverable({ type, size = 90 }: { type: string; size?: number }) {
  const configs: Record<string, React.ReactNode> = {
    proposal: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <rect x="12" y="14" width="46" height="6" rx="2" fill="#A3377B" fillOpacity="0.2"/>
        <line x1="12" y1="26" x2="58" y2="26" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="33" x2="58" y2="33" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="12" y="40" width="22" height="16" rx="2" fill="#EEF2FF"/>
        <polyline points="14,52 18,46 22,48 26,42 30,40" stroke="#A3377B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="38" y1="44" x2="56" y2="44" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="38" y1="50" x2="56" y2="50" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">営業提案書</text>
      </>
    ),
    marketing: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#A3377B" strokeWidth="2"/>
        <rect x="12" y="12" width="46" height="8" rx="2" fill="#A3377B" fillOpacity="0.15"/>
        <text x="35" y="19" textAnchor="middle" fontSize="7" fill="#A3377B">マーケ企画書</text>
        <rect x="12" y="24" width="20" height="20" rx="2" fill="#EEF2FF"/>
        <rect x="14" y="26" width="16" height="16" rx="1" fill="#A3377B" fillOpacity="0.2"/>
        <rect x="36" y="24" width="22" height="8" rx="2" fill="#D9E0EA"/>
        <rect x="36" y="36" width="22" height="8" rx="2" fill="#D9E0EA"/>
        <line x1="12" y1="50" x2="58" y2="50" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="57" x2="50" y2="57" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">マーケ企画書</text>
      </>
    ),
    pr: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <rect x="12" y="12" width="46" height="12" rx="2" fill="#172554" fillOpacity="0.08"/>
        <line x1="12" y1="30" x2="58" y2="30" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="37" x2="58" y2="37" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="44" x2="58" y2="44" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="51" x2="45" y2="51" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M50 60 L54 56 L58 60" stroke="#A3377B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">PR記事・原稿</text>
      </>
    ),
    contract: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <line x1="12" y1="18" x2="58" y2="18" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="16" cy="28" r="3" fill="#22C55E"/>
        <line x1="22" y1="28" x2="58" y2="28" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="16" cy="38" r="3" fill="#22C55E"/>
        <line x1="22" y1="38" x2="58" y2="38" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="16" cy="48" r="3" fill="#FCA5A5"/>
        <line x1="22" y1="48" x2="58" y2="48" stroke="#FCA5A5" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="16" cy="58" r="3" fill="#22C55E"/>
        <line x1="22" y1="58" x2="58" y2="58" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">契約書チェック</text>
      </>
    ),
    report: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <rect x="12" y="12" width="46" height="24" rx="2" fill="#EEF2FF"/>
        <rect x="14" y="20" width="8" height="12" rx="1" fill="#A3377B" fillOpacity="0.6"/>
        <rect x="25" y="16" width="8" height="16" rx="1" fill="#A3377B" fillOpacity="0.8"/>
        <rect x="36" y="22" width="8" height="10" rx="1" fill="#A3377B" fillOpacity="0.4"/>
        <rect x="47" y="18" width="8" height="14" rx="1" fill="#A3377B"/>
        <line x1="12" y1="42" x2="58" y2="42" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="49" x2="58" y2="49" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="56" x2="45" y2="56" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">経理・分析レポート</text>
      </>
    ),
    manual: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <rect x="8" y="6" width="8" height="68" rx="4" fill="#172554"/>
        <line x1="22" y1="20" x2="58" y2="20" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="28" x2="58" y2="28" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="36" x2="58" y2="36" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="44" x2="58" y2="44" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="52" x2="50" y2="52" stroke="#D9E0EA" strokeWidth="1.5" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">業務マニュアル</text>
      </>
    ),
    system: (
      <>
        <rect x="4" y="10" width="62" height="50" rx="4" fill="#172554"/>
        <rect x="8" y="14" width="54" height="38" rx="2" fill="#1e2d6b"/>
        <rect x="10" y="16" width="50" height="6" rx="1" fill="#A3377B" fillOpacity="0.4"/>
        <rect x="10" y="25" width="22" height="20" rx="2" fill="#A3377B" fillOpacity="0.2"/>
        <rect x="36" y="25" width="24" height="8" rx="1" fill="#A3377B" fillOpacity="0.3"/>
        <rect x="36" y="37" width="24" height="8" rx="1" fill="#A3377B" fillOpacity="0.2"/>
        <rect x="22" y="60" width="26" height="4" rx="1" fill="#172554"/>
        <rect x="16" y="64" width="38" height="3" rx="1" fill="#172554"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">生産管理システム</text>
      </>
    ),
    travel: (
      <>
        <rect x="8" y="6" width="54" height="68" rx="4" fill="white" stroke="#172554" strokeWidth="2"/>
        <rect x="12" y="12" width="46" height="20" rx="2" fill="#EEF2FF"/>
        <text x="35" y="26" textAnchor="middle" fontSize="8" fill="#172554">旅行企画資料</text>
        <line x1="12" y1="38" x2="58" y2="38" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="12" y="42" width="20" height="14" rx="2" fill="#A3377B" fillOpacity="0.1"/>
        <rect x="36" y="42" width="22" height="14" rx="2" fill="#A3377B" fillOpacity="0.15"/>
        <line x1="12" y1="62" x2="58" y2="62" stroke="#D9E0EA" strokeWidth="1.2" strokeLinecap="round"/>
        <text x="35" y="80" textAnchor="middle" fontSize="8" fill="#172554">旅行企画資料</text>
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 70 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      {configs[type] ?? configs.proposal}
    </svg>
  );
}
