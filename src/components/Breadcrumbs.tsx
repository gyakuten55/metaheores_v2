import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const SITE_URL = 'https://meta-heroes.co.jp';

const ROUTE_MAP: { [key: string]: string } = {
  'about': '企業情報',
  'company': 'MetaHeroesについて',
  'profile': '会社概要',
  'mission': 'ミッション・ビジョン',
  'offices': '事業所・施設',
  'conduct': '行動規範',
  'privacy': 'プライバシーポリシー',
  'group': 'グループ会社',
  'business': '事業内容',
  'services': 'サービス',
  'xr': 'XRソリューション',
  'holoshare': 'HoloShare',
  'hero-aivo': 'HERO AIVO',
  'ai-training': 'AI人材育成研修',
  'bousai-metaverse': '防災メタバース',
  'bousai-expo': '防災万博',
  'hero-egg-collection': 'Hero Egg Collection',
  'hero-egg': 'Hero Egg',
  'game-making-camp': 'ゲームメイキングキャンプ',
  'hero-expo': 'HERO EXPO',
  'global-hero-summit': 'THE HERO SUMMIT',
  'egg-jam': 'EGG JAM',
  'ai-monday': 'AI MONDAY',
  'game-event': 'ゲーム×イベント',
  'meta-heroes-guild': 'Meta Heroes Guild',
  'works': '実績',
  'gallery': 'ギャラリー',
  'news': 'ニュース',
  'members': 'メンバー',
  'blog': 'ブログ',
  'contact': 'お問い合わせ',
  'document-request': 'お役立ち資料',
  'recruit': '採用情報',
  'entry': '採用エントリー',
  'faq': 'よくある質問',
  'ceo-message': '代表メッセージ'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // BreadcrumbList 構造化データを出力
  useEffect(() => {
    if (location.pathname === '/') return;

    const items = [
      { name: 'HOME', url: `${SITE_URL}/` },
      ...pathnames.map((name, index) => {
        const url = `${SITE_URL}/${pathnames.slice(0, index + 1).join('/')}`;
        const label = ROUTE_MAP[name] || name;
        return { name: label.length > 20 ? '詳細' : label, url };
      }),
    ];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const scriptId = 'json-ld-breadcrumb';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [location.pathname, pathnames]);

  // トップページでは表示しない
  if (location.pathname === '/') return null;

  return (
    <nav className="relative z-50 pointer-events-none" aria-label="パンくずリスト">
      <div className="container mx-auto px-4 sm:px-8">
        <ol className="flex items-center flex-wrap gap-2 text-[10px] font-bold tracking-wider pointer-events-auto py-4">
          <li className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home size={10} />
              <span>HOME</span>
            </Link>
          </li>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = ROUTE_MAP[name] || name;

            // IDなどの長い文字列は「詳細」とする
            const displayLabel = label.length > 20 ? '詳細' : label;

            return (
              <li key={name} className="flex items-center gap-2">
                <ChevronRight size={10} className="text-gray-300" />
                {isLast ? (
                  <span className="text-gray-500 truncate max-w-[150px]">{displayLabel}</span>
                ) : (
                  <Link to={routeTo} className="text-gray-400 hover:text-blue-600 transition-colors uppercase">
                    {displayLabel}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};