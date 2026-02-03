import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  en: string;
  path: string;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '企業情報',
    en: 'ABOUT',
    path: '/about',
    children: [
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
    label: '事業内容',
    en: 'BUSINESS',
    path: '/business',
    children: [
      { label: 'メタバース', path: '/business' },
      { label: 'AI', path: '/business' },
      { label: 'イベント', path: '/business' },
      { label: '施設運営事業', path: '/business' },
    ]
  },
  {
    label: 'サービス',
    en: 'SERVICES',
    path: '/services',
    children: [
      { label: 'デジタルソリューション', path: '/services#digital' },
      { label: '教育×テクノロジー', path: '/services#social' },
      { label: '共創・コミュニティ', path: '/services#community' },
    ]
  },
  {
    label: '実績',
    en: 'WORKS',
    path: '/works',
    children: [
      { label: '実績一覧', path: '/works' },
      { label: 'ギャラリー', path: '/gallery' },
    ]
  },
  {
    label: 'メンバー',
    en: 'MEMBERS',
    path: '/members',
    children: [
      { label: 'メンバーブログ一覧', path: '/members/blog' },
    ]
  },
  {
    label: 'ニュース',
    en: 'NEWS',
    path: '/news',
  },
  {
    label: '採用情報',
    en: 'RECRUIT',
    path: '/recruit',
  },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const location = useLocation();
  const isTopPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Determine text color based on scroll and page
  const getTextColorClass = () => {
    if (isTopPage && !isScrolled && !isMobileMenuOpen) return 'text-white';
    return 'text-gray-700';
  };

  const getHamburgerColorClass = () => {
    if (isMobileMenuOpen) return 'bg-gray-900';
    if (isTopPage && !isScrolled) return 'bg-white';
    return 'bg-gray-900';
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[101] transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'bg-white h-20 sm:h-24' 
            : isScrolled 
              ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 sm:h-20 shadow-sm' 
              : 'bg-transparent h-20 sm:h-24'
        }`}
      >
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        <div className="container mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity z-50 flex-shrink-0 max-w-[60%] sm:max-w-none">
            <img 
              src="/assets/MH.png" 
              alt="Meta Heroes" 
              className={`h-10 sm:h-12 w-auto transition-all duration-300 ${
                isTopPage && !isScrolled && !isMobileMenuOpen ? 'brightness-0 invert' : ''
              }`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.label}
                className="relative flex flex-col items-center group px-2 py-4"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  to={item.path} 
                  className="relative block px-3 z-10 h-7 overflow-hidden"
                  onClick={(e) => {
                    if (item.path === '/recruit') {
                      e.preventDefault();
                      alert('採用情報は現在準備中です。最新の募集情報はIndeedをご確認ください。');
                    }
                  }}
                >
                  <div className="flex flex-col transition-transform duration-700 ease-[0.19,1,0.22,1] group-hover:-translate-y-1/2">
                    {/* Japanese */}
                    <span className={`flex items-center justify-center h-7 text-[13px] font-bold tracking-wider transition-colors duration-700 ${
                      activeDropdown === item.label ? 'text-cyan-500' : getTextColorClass()
                    }`}>
                      {item.label}
                    </span>
                    {/* English */}
                    <span className="flex items-center justify-center h-7 text-[11px] font-black tracking-[0.15em] group-hover:tracking-[0.25em] uppercase bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-clip-text text-transparent transition-all duration-700 ease-[0.19,1,0.22,1]">
                      {item.en}
                    </span>
                  </div>
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.99, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 6, scale: 0.99, filter: 'blur(2px)' }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-[calc(100%+4px)] w-72 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-sm overflow-hidden border border-gray-100 ring-1 ring-black/5"
                    >
                      {/* Top Tech Line */}
                      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
                      
                      <div className="relative z-10 flex flex-col py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="group/item relative flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition-all duration-300"
                          >
                            <span className="text-[13px] font-bold text-gray-500 group-hover/item:text-gray-900 group-hover/item:translate-x-1 transition-all duration-300 tracking-wide">
                              {child.label}
                            </span>
                            
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              strokeWidth={2} 
                              stroke="currentColor" 
                              className="w-4 h-4 text-cyan-500 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 ease-out"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="ml-4 flex items-center gap-3">
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-white bg-gray-900 rounded-full overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-500 min-w-[140px]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-6 overflow-hidden w-full text-center">
                  <div className="flex flex-col transition-all duration-500 ease-[0.23,1,0.32,1] group-hover:-translate-y-1/2">
                    <span className="flex items-center justify-center gap-1 h-6">
                      お問い合わせ
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 transition-colors duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" stroke="url(#nav-gradient)" className="group-hover:stroke-white" />
                      </svg>
                    </span>
                    <span className="flex items-center justify-center gap-1 h-6 tracking-widest font-black uppercase">
                      Contact
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                to="/document-request"
                className="group relative inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-white bg-gray-700 rounded-full overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all duration-500 min-w-[140px]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-6 overflow-hidden w-full text-center">
                  <div className="flex flex-col transition-all duration-500 ease-[0.23,1,0.32,1] group-hover:-translate-y-1/2">
                    <span className="flex items-center justify-center gap-1 h-6">
                      資料請求
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 transition-colors duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" stroke="url(#nav-gradient)" className="group-hover:stroke-white" />
                      </svg>
                    </span>
                    <span className="flex items-center justify-center gap-1 h-6 tracking-widest font-black uppercase">
                      Document
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 hover:opacity-80 transition-all ml-auto flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-full"
            aria-label="Menu"
          >
            <motion.div 
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${getHamburgerColorClass()} ${!isMobileMenuOpen && isTopPage && !isScrolled ? 'shadow-sm' : ''}`} 
            />
            <motion.div 
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${getHamburgerColorClass()} ${!isMobileMenuOpen && isTopPage && !isScrolled ? 'shadow-sm' : ''}`} 
            />
            <motion.div 
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${getHamburgerColorClass()} ${!isMobileMenuOpen && isTopPage && !isScrolled ? 'shadow-sm' : ''}`} 
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-white lg:hidden overflow-y-auto"
            >
              <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col">
                {/* Close Button (Optional redundancy if header button is covered, but here we keep header button visible) */}
                
                <nav className="flex-1 flex flex-col gap-6">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label} className="border-b border-gray-100 pb-4 last:border-0">
                      {item.children ? (
                        <div>
                          <div className="w-full flex items-center justify-between py-2 group">
                            <Link 
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex flex-col items-start text-left flex-grow"
                            >
                              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.label}
                              </span>
                              <span className="text-xs font-black tracking-widest text-blue-500 uppercase">
                                {item.en}
                              </span>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setExpandedMobileItem(expandedMobileItem === item.label ? null : item.label);
                              }}
                              className="p-2 -mr-2 text-gray-400 hover:text-blue-600 transition-colors"
                              aria-label="Toggle Submenu"
                            >
                              <motion.svg
                                animate={{ rotate: expandedMobileItem === item.label ? 180 : 0 }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </motion.svg>
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {expandedMobileItem === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pt-2 flex flex-col gap-3">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.label}
                                      to={child.path}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex items-center gap-2 text-gray-600 py-1 hover:text-blue-600 transition-colors"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                                      <span className="text-sm font-medium">{child.label}</span>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={(e) => {
                            if (item.path === '/recruit') {
                              e.preventDefault();
                              alert('採用情報は現在準備中です。最新の募集情報はIndeedをご確認ください。');
                            } else {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className="flex flex-col items-start py-2 group"
                        >
                          <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          <span className="text-xs font-black tracking-widest text-blue-500 uppercase">
                            {item.en}
                          </span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 flex flex-col gap-4 pb-12">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    <div className="flex flex-col items-start relative z-10">
                      <span className="text-lg font-bold text-white tracking-wide">お問い合わせ</span>
                      <span className="text-[10px] font-black text-white/80 tracking-[0.2em] uppercase">Contact</span>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="/document-request"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold text-gray-900 tracking-wide">資料請求</span>
                      <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Document</span>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
