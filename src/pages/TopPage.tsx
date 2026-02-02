import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPickups, getBlogs, Blog } from '../lib/microcms';
import { BusinessContentSection } from '../components/BusinessContentSection';
import { ServiceSection } from '../components/ServiceSection';
import { MovieSection } from '../components/MovieSection';

const STATIC_BANNERS = [
  {
    id: '1',
    eyecatch: { url: '/assets/top/business_bg.png' },
    title: 'eスポーツ ゲームクリエイター アカデミー 2025冬'
  },
  {
    id: '2',
    eyecatch: { url: '/assets/top/business_bg.png' },
    title: 'Meta Heroes Guild 10,000名突破'
  },
  {
    id: '3',
    eyecatch: { url: '/assets/top/business_bg.png' },
    title: 'XRソリューション 展示会出展'
  },
  {
    id: '4',
    eyecatch: { url: '/assets/top/business_bg.png' },
    title: '謹賀新年 2026'
  },
  {
    id: '5',
    eyecatch: { url: '/assets/top/business_bg.png' },
    title: 'EGG JAM 開催決定'
  }
];

const PLACEHOLDER_IMAGE = '/assets/top/business_bg.png';

export const TopPage: React.FC = () => {
  const [banners, setBanners] = useState<any[]>(STATIC_BANNERS);
  const [newsItems, setNewsItems] = useState<Blog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersData, newsData] = await Promise.all([
          getPickups(),
          getBlogs(20, undefined, { excludeCategoryId: 'announcement' }),
        ]);

        if (bannersData.contents.length > 0) {
          setBanners(bannersData.contents);
          setCurrentIndex(0);
        }

        setNewsItems(newsData.contents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter news based on tab
  const filteredNews = newsItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'news_release') return item.category_new?.some(c => c === 'PRtimes' || c === 'press' || c === 'ニュースリリース');
    if (activeTab === 'information') return item.category_new?.some(c => c === 'info' || c === 'information' || c === 'インフォメーション' || c === 'お知らせ');
    if (activeTab === 'knowledge') return item.category_new?.some(c => c === 'knowledge' || c === 'ナレッジ');
    if (activeTab === 'blog') return item.category_new?.some(c => c === 'blog' || c === 'ブログ');
    return true;
  });

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
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ... (Hero Slider Section remains the same) */}
      <section className="relative pt-24 md:pt-48 pb-0 overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 relative">
          {/* Main Slider - Consistent size for all slides */}
          <div className="relative flex items-center justify-center h-[200px] md:h-[480px] mb-12 md:mb-28 overflow-visible">
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
                    <Link to={`/blog/${banner.id}`} className="block w-full h-full">
                      <img 
                        src={banner.eyecatch?.url || PLACEHOLDER_IMAGE} 
                        alt={banner.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                      />
                    </Link>
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
            <div className="text-3xl md:text-7xl font-black italic tracking-tighter leading-none">
              2044年
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catchphrase Section - HERO100つくる */}
      <section className="pt-2 pb-2 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block text-xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent">
              HERO100つくる
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white overflow-hidden relative min-h-[600px] md:min-h-[700px] flex flex-col justify-center py-16 md:py-24">
        {/* Video Side - Right Edge, Full Height, Left 50% content, Narrower width */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[40%] overflow-hidden z-0 hidden lg:block">
          <div className="absolute inset-0 w-[200%] h-full">
            <video 
              src="/assets/top/1-1_toppage_video.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          {/* White fade overlay for natural blending */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden lg:block" />
          {/* Overlay for mobile readability if text overlaps video */}
          <div className="absolute inset-0 bg-white/40 lg:hidden" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 block mb-1 uppercase">OUR MISSION</span>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">MetaHeroesの使命</h2>
              <div className="w-8 h-0.5 bg-blue-600" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content Area - Left side */}
            <div className="w-full lg:w-[60%] space-y-8 lg:pr-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-wide text-gray-900 leading-tight">
                Society 5.0 × SDGs × HERO
              </h2>
              
              <div className="space-y-6 text-sm md:text-base font-medium text-gray-600 leading-loose">
                <p>
                  テクノロジーによって描かれた未来の社会「Society 5.0」と、世界が目指すべき目標「SDGs」を実現するためには、行動力のある個人、つまり「ヒーロー」が必要です。
                </p>
                <p>
                  そのために、「学ぶ人」「挑戦する人」「変革する人」を次々と生み出す仕組みを作り、未来を実現する人材で満たされた世界を目指します。
                </p>
              </div>

              <div className="pt-2">
                <Link 
                  to="/about/mission" 
                  className="inline-flex items-center gap-3 px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black rounded-full hover:shadow-lg hover:scale-105 transition-all group"
                >
                  もっと見る
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Image Area - Overlapping the video background, aligned with text height */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-8 mt-12 lg:mt-0">
              <img 
                src="/assets/top/society_sdgs.png" 
                alt="Society 5.0 x SDGs" 
                className="max-w-full max-h-[300px] md:max-h-[400px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About MetaHeroes Section */}
      <section className="bg-white overflow-hidden relative min-h-[600px] md:min-h-[700px] flex flex-col justify-center py-16 md:py-24">
        {/* Video Side - LEFT Edge, Full Height, Left 50% content, Narrower width */}
        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[40%] overflow-hidden z-0 hidden lg:block">
          <div className="absolute inset-0 w-[200%] h-full">
            <video 
              src="/assets/top/2025_mh_achievements_02.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          {/* White fade overlay for natural blending (Right side of video) */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 hidden lg:block" />
          {/* Overlay for mobile readability if text overlaps video */}
          <div className="absolute inset-0 bg-white/40 lg:hidden" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 block mb-1 uppercase">ABOUT US</span>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">MetaHeroesについて</h2>
              <div className="w-8 h-0.5 bg-blue-600" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            {/* Image Area - Moved to bottom on mobile, stays on left on desktop */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-8 mb-12 lg:mb-0 order-2 lg:order-1">
              <img 
                src="/assets/top/about_meta_heroes_02.png" 
                alt="About MetaHeroes" 
                className="max-w-full max-h-[350px] md:max-h-[450px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* Text Content Area - Moved to top on mobile, stays on right on desktop */}
            <div className="w-full lg:w-[60%] space-y-8 lg:pl-16 order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-wide text-gray-900 leading-tight">
                デジタル×リアルで新しい社会価値を生み出す
              </h2>
              
              <div className="space-y-6 text-sm md:text-base font-medium text-gray-600 leading-loose">
                <p>
                  私たちMeta Heroesは、教育・防災・地方創生などの様々な分野で抱える社会課題を、テクノロジー開発とリアルの場でのイベントを通じた、社会課題を解決するソーシャルイノベーターです。
                </p>
                <p>
                  社会に存在する「課題」を、テクノロジーとエンターテインメントの力で「希望」に変え、デジタルとリアルの境界をなくし、誰もがヒーローになれる舞台を作る役割を果たします。
                </p>
              </div>

              <div className="pt-2">
                <Link 
                  to="/about/company" 
                  className="inline-flex items-center gap-3 px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black rounded-full hover:shadow-lg hover:scale-105 transition-all group"
                >
                  もっと見る
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Content Section */}
      <BusinessContentSection />

      {/* Service Section */}
      <ServiceSection />

      {/* Movie Section */}
      <MovieSection />

      {/* News Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 block mb-1 uppercase">NEWS</span>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ニュース</h2>
              <div className="w-8 h-0.5 bg-blue-600" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-6 md:justify-center gap-x-6 md:gap-x-8 gap-y-2 border-b border-gray-100 max-w-3xl mx-auto px-4 scrollbar-hide -mx-4 md:mx-auto pl-4 md:pl-4">
            {[
              { id: 'all', label: 'すべて' },
              { id: 'news_release', label: 'ニュースリリース' },
              { id: 'information', label: 'インフォメーション' },
              { id: 'knowledge', label: 'ナレッジ' },
              { id: 'blog', label: 'ブログ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs font-bold tracking-wider relative transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* News List */}
          <div className="max-w-3xl mx-auto px-2 md:px-0">
            {filteredNews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNews.slice(0, 5).map((item) => (
                  <Link key={item.id} to={`/blog/${item.id}`} className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 md:py-3 hover:bg-gray-50/50 transition-all px-2 -mx-2 rounded-lg">
                    <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                      <time className="text-[11px] md:text-[13px] font-bold text-gray-900 font-mono w-auto md:w-24">
                        {formatDate(item.publishedAt)}
                      </time>
                    </div>
                    <h3 className="text-sm md:text-[14px] font-bold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-1 flex-grow leading-relaxed md:leading-normal">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-300 text-sm font-bold tracking-widest">
                該当する記事がありません
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center">
             <Link to="/news" className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors tracking-[0.2em] border-b border-gray-100 hover:border-blue-600 pb-1">
               VIEW ALL
             </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
            {[
              { label: '企業情報', iconPath: '/assets/top/company_icon.png', image: '/assets/recruit/about_meta_heroes.png', path: '/about' },
              { label: 'サービス', iconPath: '/assets/top/service_icon.png', image: '/assets/recruit/services.png', path: '/services' },
              { label: '採用', iconPath: '/assets/top/recruit_icon.png', image: '/assets/recruit/recruit_top.jpg', path: '/recruit' },
              { label: 'ブログ', iconPath: '/assets/top/blog_icon.png', image: '/assets/top/business_bg.png', path: '/news' },
            ].map((cat, idx) => (
              <Link 
                key={idx} 
                to={cat.path} 
                className="relative group aspect-square md:aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl"
                onClick={(e) => {
                  if (cat.path === '/recruit') {
                    e.preventDefault();
                    alert('採用情報は現在準備中です。最新の募集情報はIndeedをご確認ください。');
                  }
                }}
              >
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2 md:gap-5">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <div className="w-8 h-8 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center p-2 md:p-3">
                      <img src={cat.iconPath} alt={cat.label} className="w-full h-full object-contain" />
                    </div>
                  </motion.div>
                  <span className="text-xs md:text-base font-black tracking-[0.2em] md:tracking-[0.3em]">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};