import React, { useState, useMemo, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

type ServiceCategory = 'all' | 'metaverse' | 'ai' | 'event' | 'vacant-facility';
// ... (previous interfaces)

interface ServiceItem {
  id: string;
  category: string;
  type: ServiceCategory;
  title: string;
  description: string;
  image: string;
  section: 'digital' | 'social' | 'community';
  path?: string;
}

const SERVICES: ServiceItem[] = [
  // Digital Solution
  { id: 'xr-sol', section: 'digital', type: 'metaverse', category: 'メタバース', title: 'XRソリューション', description: '仮想現実(VR)や拡張現実(AR)を用いた総合的なソリューションをご提供します。', image: '/assets/services/first-view/xr_solutions.png', path: '/services/xr' },
  { id: 'holoshare', section: 'digital', type: 'metaverse', category: 'メタバース', title: 'holoshare', description: '持ち運び困難な製品を目の前に。商談を円滑にする営業特化型VRツールです。', image: '/assets/services/first-view/HS_logo.png', path: '/services/holoshare' },
  { id: 'hero-aivo', section: 'digital', type: 'ai', category: 'AI特化型Web制作・運用', title: 'HERO AIVO', description: '生成AI(LLM)に最適化された最新のWebサイト制作・運用サービスです。', image: '/assets/services/first-view/HERO AIVO_logo.png', path: '/services/hero-aivo' },
  { id: 'ai-training', section: 'digital', type: 'ai', category: 'AI企業研修', title: 'AI 人材育成研修', description: '企業・団体向けのAIリテラシー向上および実践的な活用研修サービスです。', image: '/assets/services/first-view/ai_training.png', path: '/services/ai-training' },

  // Social & Education
  { id: 'bousai-meta', section: 'social', type: 'metaverse', category: 'メタバース', title: '防災メタバース', description: '仮想空間や複合現実を用いた、没入感のある最先端の防災訓練サービスです。', image: '/assets/services/first-view/防災メタバース.png', path: '/services/bousai-metaverse' },
  { id: 'bousai-expo', section: 'social', type: 'event', category: 'イベント', title: '防災万博/こども防災万博', description: '家族・コミュニティ・学校で楽しく防災を学べる、体験型の大規模イベントです。', image: '/assets/services/first-view/防災万博_logo_black_B.png', path: '/services/bousai-expo' },
  { id: 'hero-egg-col', section: 'social', type: 'event', category: 'イベント', title: 'Hero Egg COLLECTION', description: 'こどもたちの自由なアイデアをビジネスの種へと育てる公募イベントです。', image: '/assets/services/first-view/HEC_logo_A.png', path: '/services/hero-egg-collection' },
  { id: 'hero-expo', section: 'social', type: 'event', category: 'イベント', title: 'HERO EXPO', description: 'メタバースやXRなどの先端技術を活用し、未来の防災を考えるイベントです。', image: '/assets/services/first-view/HERO EXPO_Logo.png', path: '/services/hero-expo' },
  { id: 'game-making', section: 'social', type: 'event', category: 'ゲームクリエイター体験会', title: 'ゲームメイキングキャンプ', description: 'プロから学ぶ、こども向けゲーム制作ワークショップ・体験会です。', image: '/assets/services/first-view/ゲームメイキングキャンプ.png', path: '/services/game-making-camp' },
  { id: 'hero-egg', section: 'social', type: 'vacant-facility', category: 'DX教室施設運用', title: 'Hero Egg', description: '子どもから大人まで学べるDX教育施設。子どもたちは無料でテクノロジーを学べます。', image: '/assets/services/first-view/Hero Egg_logo.png', path: '/services/hero-egg' },

  // Community & Co-creation
  { id: 'ghs', section: 'community', type: 'event', category: 'イベント', title: 'GLOBAL HERO SUMMIT', description: '企業やクリエイターが集まり、新たな価値を創造するカンファレンスです。', image: '/assets/services/first-view/GHS_logo_black_A.png', path: '/services/global-hero-summit' },
  { id: 'egg-jam', section: 'community', type: 'event', category: 'オンラインコミュニティ', title: 'EGG JAM', description: '挑戦する人を応援し、交流を深めるオンラインコミュニティです。', image: '/assets/services/first-view/EGG JAM_Logo_B.png', path: '/services/egg-jam' },
  { id: 'ai-monday', section: 'community', type: 'ai', category: 'ハイブリッドコミュニティ', title: 'AI MONDAY', description: 'AIの最新トレンドを共有し、学び合う専門コミュニティです。', image: '/assets/services/first-view/AI MONDAY_Logo.png', path: '/services/ai-monday' },
  { id: 'game-event', section: 'community', type: 'metaverse', category: 'メタバース×イベント', title: 'ゲーム × イベント', description: 'ゲームの力を活用し、地域や企業イベントを盛り上げる企画運営です。', image: '/assets/services/first-view/ゲーム×イベント.png', path: '/services/game-event' },
  { id: 'mh-guild', section: 'community', type: 'vacant-facility', category: 'コミュニティスペース', title: 'Meta Heroes Guild', description: '特定のテーマで、飲食ができるコミュニティスペースです。', image: '/assets/services/first-view/Meta Heroes Guild_logo.png', path: '/services/meta-heroes-guild' },
];

export const ServicesPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory>('all');
  const { hash } = useLocation();

  const filteredServices = useMemo(() => {
    return SERVICES.filter(item => {
      const matchCategory = categoryFilter === 'all' || item.type === categoryFilter;
      return matchCategory;
    });
  }, [categoryFilter]);

  const digitalServices = filteredServices.filter(s => s.section === 'digital');
  const socialServices = filteredServices.filter(s => s.section === 'social');
  const communityServices = filteredServices.filter(s => s.section === 'community');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // Wait a bit for the page to render
      const timer = setTimeout(() => {
        scrollToSection(id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-white pb-32 text-gray-800">
      <PageHero titleEn="SERVICE" titleJa="サービス" />

      {/* Full-width Intro Banner Section */}
      <section className="relative w-full overflow-hidden">
        {/* Base Image (100% width) - Reduced height and optimized fit */}
        <div className="w-full h-[200px] md:h-[320px]">
          <img 
            src="/assets/services/top/サービストップサムネイル.png" 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay Text Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-24">
            <div className="max-w-xl bg-white/20 backdrop-blur-sm md:backdrop-blur-none p-6 md:p-0 rounded-2xl">
              <p className="text-gray-800 leading-[1.8] font-black tracking-widest text-sm md:text-lg drop-shadow-md">
                Meta Heroesは、メタバース開発やイベント、AI人材育成研修を始めとした、さまざまなサービスを展開しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Section with Gradient Background and Digital Wave Overlay */}
      <section className="relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-24 mb-32 overflow-hidden">
        {/* Decorative Wave Background */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="/assets/services/top/bg_デジタルウェーブ.png" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'digital', label: 'デジタルソリューション', en: 'XR & AI Solutions', image: '/assets/services/top/デジタルソリューション_コンテナ.png', icon: '/assets/services/top/デジタルソリューション_icon.png' },
              { id: 'social', label: '防災・教育・次世代育成', en: 'Social & Education', image: '/assets/services/top/防災・教育・次世代育成_コンテナ.png', icon: '/assets/services/top/防災・教育・次世代育成_icon.png' },
              { id: 'community', label: '共創・コミュニティ', en: 'Community & Co-creation', image: '/assets/services/top/共創・コミュニティ_コンテナ.png', icon: '/assets/services/top/共創・コミュニティ_icon.png' },
            ].map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => scrollToSection(cat.id)}
                className="relative group rounded-3xl overflow-hidden aspect-[16/9] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10 text-left"
              >
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black p-6">
                  <div className="w-12 h-12 mb-3">
                    <img src={cat.icon} alt="" className="w-full h-full object-contain brightness-0 drop-shadow-lg" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase block mb-1 text-black/80">{cat.en}</span>
                    <span className="text-xl md:text-2xl font-black tracking-wider">{cat.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-xl border-y border-gray-100 py-10 mb-24">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-center">
            <span className="text-[11px] font-black text-gray-400 tracking-[0.2em] w-20 border-r border-gray-100 hidden md:block">種 類</span>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'すべて' },
                { id: 'metaverse', label: 'メタバース' },
                { id: 'ai', label: 'AI' },
                { id: 'event', label: 'イベント' },
                { id: 'vacant-facility', label: '空き施設活用' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setCategoryFilter(btn.id as ServiceCategory)}
                  className={`px-8 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all duration-500 ${
                    categoryFilter === btn.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-100/50 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Sections */}
      <div className="container mx-auto px-4 max-w-6xl space-y-40">
        {[
          { id: 'digital', title: 'デジタルソリューション', en: 'XR & AI SOLUTIONS', data: digitalServices },
          { id: 'social', title: '防災・教育・次世代育成', en: 'SOCIAL & EDUCATION', data: socialServices },
          { id: 'community', title: '共創・コミュニティ', en: 'COMMUNITY & CO-CREATION', data: communityServices },
        ].map(section => section.data.length > 0 && (
          <section key={section.id} id={section.id}>
            <div className="mb-16">
              <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase block mb-3">{section.en}</span>
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-3xl font-black text-gray-800 tracking-wider">{section.title}</h2>
                <div className="w-full h-px bg-gray-100 relative mt-2">
                  <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <p className="mt-8 text-sm font-bold text-gray-400 tracking-widest">最新テクノロジーを活用し、ビジネスの課題解決や新しい体験価値を提供するサービスです。</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
              {section.data.map(service => {
                const CardContent = (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-white mb-6 relative">
                      <img 
                        src={service.image} 
                        alt="" 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>

                    {/* Title & Category Row */}
                    <div className="flex items-start gap-3 mb-4">
                      {/* Arrow Icon */}
                      <div className="w-6 h-6 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-blue-500 group-hover:text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                      
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold mb-1 tracking-wider">{service.category}</span>
                        <h3 className="text-base font-black text-gray-800 tracking-wider group-hover:text-blue-600 transition-colors">{service.title}</h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-[1.8] font-medium tracking-wide">
                      {service.description}
                    </p>
                  </motion.div>
                );

                return service.path ? (
                  <Link key={service.id} to={service.path} className="block h-full">
                    {CardContent}
                  </Link>
                ) : (
                  <div key={service.id} className="block h-full">
                    {CardContent}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {filteredServices.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-gray-400 font-bold tracking-widest">該当するサービスが見つかりませんでした</p>
          </div>
        )}
      </div>
    </main>
  );
};