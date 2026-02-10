import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOOTER_COLUMNS = [
  // ... (Keep existing columns data)
  // Column 1: Enterprise (7 items)
  [
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
    }
  ],
  // Column 2: Business & Services (4 + 3 = 7 items)
  [
    {
      title: '事業内容',
      path: '/business',
      links: [
        { label: 'メタバース', path: '/business' },
        { label: 'AI', path: '/business' },
        { label: 'イベント', path: '/business' },
        { label: '施設運営事業', path: '/business' },
      ]
    },
    {
      title: 'サービス',
      path: '/services',
      links: [
              { label: 'デジタルソリューション', path: '/services#digital' },
              { label: '教育×テクノロジー', path: '/services#social' },
              { label: '共創・コミュニティ', path: '/services#community' },      ]
    }
  ],
  // Column 3: Works & Others (2 + 1 + 2 = 5 items)
  [
    {
      title: '実績・メンバー',
      path: '/works',
      links: [
        { label: '実績一覧', path: '/works' },
        { label: 'ギャラリー', path: '/gallery' },
        { label: 'メンバーブログ', path: '/members/blog' },
      ]
    },
        {
          title: 'その他',
          path: '#',
          links: [
            { label: 'ニュース一覧', path: '/news' },
            { label: '採用情報', path: '/recruit' },
            { label: 'お問い合わせ', path: '/contact' },
            { label: 'お役立ち資料', path: '/document-request' },
            { label: '代理店専用', path: '/agency-login' },
          ]
        }
      ]
    ];
    
    const FooterSection = ({ section }: { section: typeof FOOTER_COLUMNS[0][0] }) => {
      const [isOpen, setIsOpen] = useState(false);
    
      return (
        <div className="w-full border-b border-gray-100 last:border-0 md:border-0">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default group"
          >
            <h3 className="text-gray-900 font-black text-sm tracking-widest md:mb-4 md:border-l-4 border-blue-600 md:pl-4">
              {section.path !== '#' ? (
                <Link to={section.path} className="hover:text-blue-600 transition-colors pointer-events-auto">
                  {section.title}
                </Link>
              ) : (
                section.title
              )}
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
    
          {/* Mobile Accordion Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.ul 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden md:hidden pb-4 space-y-3"
              >
                            {section.links.map((link) => (
                              <li key={link.label}>
                                {link.path.startsWith('http') ? (
                                  <a 
                                    href={link.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-xs font-bold transition-colors block pl-4 ${
                                      link.label === '代理店専用' 
                                        ? 'text-blue-600 hover:text-gray-500' 
                                        : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                  >
                                    {link.label}
                                  </a>
                                ) : (
                                  <Link 
                                    to={link.path}
                                    className={`text-xs font-bold transition-colors block pl-4 ${
                                      link.label === '代理店専用' 
                                        ? 'text-blue-600 hover:text-gray-500' 
                                        : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                  >
                                    {link.label}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                
                      {/* Desktop List (Always Visible) */}
                      <ul className="hidden md:block space-y-3">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            {link.path.startsWith('http') ? (
                              <a 
                                href={link.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[13px] font-bold transition-colors block ${
                                  link.label === '代理店専用' 
                                    ? 'text-blue-600 hover:text-gray-500' 
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                              >
                                {link.label}
                              </a>
                            ) : (
                              <Link 
                                to={link.path}
                                className={`text-[13px] font-bold transition-colors block ${
                                  link.label === '代理店専用' 
                                    ? 'text-blue-600 hover:text-gray-500' 
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                              >
                                {link.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>        </div>
      );
    };
    
    export const Footer: React.FC = () => {
      return (
        <footer className="bg-white border-t border-gray-100 pt-10 md:pt-24 pb-12">
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
    
          <div className="container mx-auto px-4 sm:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-0 md:gap-y-12 mb-12">
              {FOOTER_COLUMNS.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-0 md:gap-10">
                  {column.map((section) => (
                    <FooterSection key={section.title} section={section} />
                  ))}
                </div>
              ))}
            </div>
    
            <div className="flex flex-col items-center pt-10 md:pt-12 border-t border-gray-50">
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
            <a href="https://www.instagram.com/metaheroes100/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#E4405F] hover:text-white transition-all duration-300">
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