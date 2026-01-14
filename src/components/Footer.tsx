import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

const FOOTER_MAP = [
  {
    title: '企業情報',
    path: '/about',
    links: [
      { label: '代表メッセージ', path: '/ceo-message' },
      { label: '会社概要', path: '/about/profile' },
      { label: 'MetaHeroesの使命', path: '/about/mission' },
      { label: 'MetaHeroesについて', path: '/about/company' },
      { label: '事業所・施設', path: '/about/offices' },
      { label: '行動規範', path: '/about/conduct' },
      { label: 'グループ会社', path: '/about/group' },
    ]
  },
  {
    title: '事業内容',
    path: '/business',
    links: [
      { label: 'メタバース', path: '/business' },
      { label: 'AI', path: '/business' },
      { label: 'イベント', path: '/business' },
      { label: '空きスペース', path: '/business' },
    ]
  },
  {
    title: 'サービス',
    path: '/services',
    links: [
      { label: 'デジタルソリューション', path: '/services#digital' },
      { label: '防災・教育・次世代育成', path: '/services#social' },
      { label: '共創・コミュニティ', path: '/services#community' },
    ]
  },
  {
    title: '実績',
    path: '/works',
    links: [
      { label: '実績一覧', path: '/works' },
      { label: 'ギャラリー', path: '/gallery' },
    ]
  },
  {
    title: 'メンバー',
    path: '/members',
    links: [
      { label: 'メンバーブログ一覧', path: '#' },
    ]
  },
  {
    title: 'その他',
    path: '#',
    links: [
      { label: 'ニュース一覧', path: '/news' },
      { label: '採用情報', path: '/recruit' },
      { label: 'お問い合わせ', path: '/contact' },
    ]
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto px-4 sm:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          {FOOTER_MAP.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-900 font-black text-sm tracking-widest mb-6 border-l-4 border-blue-600 pl-4">
                {section.path !== '#' ? (
                  <Link to={section.path} className="hover:text-blue-600 transition-colors">
                    {section.title}
                  </Link>
                ) : (
                  section.title
                )}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith('http') ? (
                      <a 
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.path}
                        className="text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Action Buttons Column */}
          <div className="flex flex-col gap-3">
            <div className="h-5 mb-6 hidden lg:block" /> {/* Spacer for title alignment */}
            
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-black bg-white border border-black rounded-full overflow-hidden transition-all duration-500 w-full"
            >
              <span className="absolute inset-0 w-full h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-6 overflow-hidden w-full text-center">
                <div className="flex flex-col transition-all duration-500 ease-[0.23,1,0.32,1] group-hover:-translate-y-1/2">
                  <span className="flex items-center justify-center h-6 group-hover:text-white transition-colors duration-500">
                    お問い合わせ
                  </span>
                  <span className="flex items-center justify-center h-6 tracking-widest font-black uppercase text-[10px] text-white">
                    Contact
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/document-request"
              className="group relative inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-black bg-white border border-black rounded-full overflow-hidden transition-all duration-500 w-full"
            >
              <span className="absolute inset-0 w-full h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-6 overflow-hidden w-full text-center">
                <div className="flex flex-col transition-all duration-500 ease-[0.23,1,0.32,1] group-hover:-translate-y-1/2">
                  <span className="flex items-center justify-center h-6 group-hover:text-white transition-colors duration-500">
                    資料請求
                  </span>
                  <span className="flex items-center justify-center h-6 tracking-widest font-black uppercase text-[10px] text-white">
                    Document
                  </span>
                </div>
              </div>
            </Link>

            <a
              href="#"
              className="group relative inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-black bg-white border border-black rounded-full overflow-hidden transition-all duration-500 w-full"
            >
              <span className="absolute inset-0 w-full h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-6 overflow-hidden w-full text-center">
                <div className="flex flex-col transition-all duration-500 ease-[0.23,1,0.32,1] group-hover:-translate-y-1/2">
                  <span className="flex items-center justify-center h-6 group-hover:text-white transition-colors duration-500">
                    代理店専用
                  </span>
                  <span className="flex items-center justify-center h-6 tracking-widest font-black uppercase text-[10px] text-white">
                    Agency
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center pt-12 border-t border-gray-50">
          {/* Logo */}
          <Link to="/" className="mb-12 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/MH.png" 
              alt="Meta Heroes" 
              className="h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
            />
          </Link>

          {/* Policies */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-10">
            <Link to="/about/privacy" className="text-gray-400 hover:text-gray-600 transition-colors text-[10px] tracking-wider uppercase font-bold">Privacy Policy</Link>
            <Link to="/contact/privacy" className="text-gray-400 hover:text-gray-600 transition-colors text-[10px] tracking-wider uppercase font-bold">Contact Privacy</Link>
            <Link to="/contact" className="text-gray-400 hover:text-gray-600 transition-colors text-[10px] tracking-wider uppercase font-bold">Contact</Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mb-10">
            <a href="https://line.me/R/ti/p/@226osklk?ts=01231849&oat_content=url" target="_blank" rel="noopener noreferrer" aria-label="LINE" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#06C755] hover:text-white transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.5C7.2 2.5 3.5 5.6 3.5 9.4c0 2.3 1.4 4.4 3.5 5.7 0.3 0.1 0.6 0.4 0.5 0.9l-0.6 2.1c-0.2 0.7 0.5 1.1 1 0.6l2.9-2.2c0.4-0.3 0.9-0.5 1.4-0.5 0.2 0 0.5 0 0.7 0 5.4 0 9-3.1 9-6.9 0-3.8-3.6-6.9-9.9-6.9z" />
              </svg>
            </a>
            <a href="https://x.com/MetaHeroes_100" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all duration-300">
              <Twitter size={20} />
            </a>
            <a href="https://www.facebook.com/people/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BEMetaHeroes/100094289003996/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/metaheroes100/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#E4405F] hover:text-white transition-all duration-300">
              <Instagram size={20} />
            </a>
            <a href="https://www.youtube.com/@MetaHeroes" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#FF0000] hover:text-white transition-all duration-300">
              <Youtube size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-300 text-[10px] tracking-widest uppercase font-bold">
              &copy; {new Date().getFullYear()} Meta Heroes Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};