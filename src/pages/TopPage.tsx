import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPickups, getBlogs, getAnnouncements, Blog } from '../lib/microcms';

const STATIC_BANNERS = [
  {
    id: '1',
    eyecatch: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop' },
    title: 'eスポーツ ゲームクリエイター アカデミー 2025冬'
  },
  {
    id: '2',
    eyecatch: { url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop' },
    title: 'Meta Heroes Guild 10,000名突破'
  },
  {
    id: '3',
    eyecatch: { url: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop' },
    title: 'XRソリューション 展示会出展'
  },
  {
    id: '4',
    eyecatch: { url: 'https://images.unsplash.com/photo-1454165833762-b3765e972f4d?q=80&w=2070&auto=format&fit=crop' },
    title: '謹賀新年 2026'
  },
  {
    id: '5',
    eyecatch: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop' },
    title: 'EGG JAM 開催決定'
  }
];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop';

export const TopPage: React.FC = () => {
  const [banners, setBanners] = useState<any[]>(STATIC_BANNERS);
  const [newsItems, setNewsItems] = useState<Blog[]>([]);
  const [announcements, setAnnouncements] = useState<Blog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersData, newsData, announcementsData] = await Promise.all([
          getPickups(),
          getBlogs(8, undefined, { excludeCategoryId: 'announcement' }),
          getAnnouncements(5)
        ]);

        if (bannersData.contents.length > 0) {
          setBanners(bannersData.contents);
          setCurrentIndex(Math.floor(bannersData.contents.length / 2));
        }

        setNewsItems(newsData.contents);
        setAnnouncements(announcementsData.contents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Slider Section */}
      <section className="relative pt-48 pb-0 overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 relative">
          {/* Main Slider - Consistent size for all slides */}
          <div className="relative flex items-center justify-center h-[280px] md:h-[480px] mb-28 overflow-visible">
            <AnimatePresence mode="popLayout" initial={false}>
              {banners.map((banner, index) => {
                let position = index - currentIndex;
                
                if (position < -2) position += banners.length;
                if (position > 2) position -= banners.length;

                const isVisible = Math.abs(position) <= 1;
                
                return (
                  <motion.div
                    key={banner.id}
                    initial={false}
                    animate={{
                      // Position at 105% to maintain a small gap while keeping them large
                      x: `${position * 105}%`,
                      scale: 1, // Same size for all
                      opacity: isVisible ? 1 : 0,
                      zIndex: isVisible ? 10 - Math.abs(position) : 0,
                    }}
                    transition={{ 
                      duration: 0.7, 
                      ease: [0.23, 1, 0.32, 1] 
                    }}
                    className="absolute w-[80%] md:w-[70%] aspect-video rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-white border-[1px] border-white/20"
                  >
                    <img 
                      src={banner.eyecatch?.url || PLACEHOLDER_IMAGE} 
                      alt={banner.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls Container */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all group active:scale-90 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex justify-center gap-3 md:gap-5">
              {banners.map((banner, index) => (
                <div key={banner.id} className="relative flex flex-col items-center">
                  <button
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-16 md:w-28 aspect-video rounded-none overflow-hidden transition-all duration-300 ${
                      currentIndex === index ? 'scale-110 shadow-xl opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={banner.eyecatch?.url || PLACEHOLDER_IMAGE} alt="" className="w-full h-full object-cover" />
                  </button>
                  {currentIndex === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-4 w-[80%] h-1 bg-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all group active:scale-90 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* 2044年 Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white drop-shadow-2xl pb-2"
          >
            <div className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none">
              2044年
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catchphrase Section - HERO100つくる */}
      <section className="pt-2 pb-10 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block text-2xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent">
              HERO100つくる
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="pb-24 pt-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.4em] text-gray-400 block mb-3 uppercase">NEWS</span>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl font-black text-gray-900">ニュース</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 max-w-6xl mx-auto mb-20">
            {newsItems.map((item) => (
              <a key={item.id} href={`/blog/${item.id}`} className="group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img src={item.eyecatch?.url || PLACEHOLDER_IMAGE} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="space-y-3">
                  <p className="text-gray-900 text-sm md:text-base font-bold leading-snug line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <div className="w-full h-px bg-gray-100" />
                  <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">
                    {formatDate(item.publishedAt)}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/news" 
              className="group relative inline-flex items-center gap-3 px-12 py-4 bg-gray-900 text-white text-sm font-bold rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                ニュース一覧
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Information Section (Announcements) */}
      {announcements.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-[0.4em] text-gray-400 block mb-3 uppercase">INFORMATION</span>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl font-black text-gray-900">お知らせ</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
              {announcements.map((item) => (
                <Link key={item.id} to={`/blog/${item.id}`} className="block border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                  <div className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                    <time className="text-sm font-bold text-gray-400 font-mono flex-shrink-0">
                      {formatDate(item.publishedAt)}
                    </time>
                    <h3 className="text-base font-bold text-gray-800 line-clamp-1 flex-grow group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <span className="hidden md:block text-gray-300 group-hover:translate-x-1 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { label: '企業情報', iconPath: '/assets/top/企業情報_icon.png', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800' },
              { label: 'サービス', iconPath: '/assets/top/サービス_icon.png', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800' },
              { label: '採用', iconPath: '/assets/top/採用情報_icon.png', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800' },
              { label: 'ブログ', iconPath: '/assets/top/ブログ_icon.png', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800' },
            ].map((cat, idx) => (
              <a key={idx} href="#" className="relative group aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl">
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-5">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3">
                      <img src={cat.iconPath} alt={cat.label} className="w-full h-full object-contain" />
                    </div>
                  </motion.div>
                  <span className="text-base font-black tracking-[0.3em]">{cat.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};