import React, { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

type Solution = 'all' | 'digital' | 'education' | 'community';

interface ServiceItem {
  id: string;
  category: string;
  solution: Solution | Solution[];
  title: string;
  description: string;
  image: string;
  path?: string;
}

const SERVICES: ServiceItem[] = [
  { id: 'ai-training', solution: 'digital', category: 'AI企業研修', title: 'AI 人材育成研修', description: '企業・団体向けのAIリテラシー向上および実践的な活用研修サービスです。', image: '/assets/services/first-view/ai_training_thumb.png', path: '/services/ai-training' },
  { id: 'ai-monday', solution: ['digital', 'community'], category: 'ハイブリッドコミュニティ', title: 'AI MONDAY', description: 'AIの最新トレンドを共有し、学び合う専門コミュニティです。', image: '/assets/services/first-view/ai_monday_thumb.png', path: '/services/ai-monday' },
  { id: 'ghs', solution: 'community', category: 'イベント', title: 'THE HERO SUMMIT', description: '企業やクリエイターが集まり、新たな価値を創造するカンファレンスです。', image: '/assets/services/first-view/ghs_first_thumb.png', path: '/services/global-hero-summit' },
  { id: 'mh-guild', solution: 'community', category: 'コミュニティスペース', title: 'Meta Heroes Guild', description: '特定のテーマで、飲食ができるコミュニティスペースです。', image: '/assets/services/first-view/mhg_first_thumb.png', path: '/services/meta-heroes-guild' },
  { id: 'hero-egg', solution: 'education', category: 'DX教室施設運用', title: 'Hero Egg', description: '子どもから大人まで学べるDX教育施設。子どもたちは無料でテクノロジーを学べます。', image: '/assets/services/first-view/hero_egg_thumb.png', path: '/services/hero-egg' },
  { id: 'egg-jam', solution: ['education', 'community'], category: 'オンラインコミュニティ', title: 'EGG JAM', description: '挑戦する人を応援し、交流を深めるオンラインコミュニティです。', image: '/assets/services/first-view/egg_jam_thumb.png', path: '/services/egg-jam' },
];

const SOLUTIONS: { id: Solution; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'digital', label: 'AI・XRソリューション' },
  { id: 'education', label: '教育×テクノロジー' },
  { id: 'community', label: 'イベント・コミュニティ・共創' },
];

const HASH_TO_SOLUTION: Record<string, Solution> = {
  '#digital': 'digital',
  '#education': 'education',
  '#social': 'education',
  '#community': 'community',
};

export const ServicesPage: React.FC = () => {
  const location = useLocation();
  const [filter, setFilter] = useState<Solution>(() => HASH_TO_SOLUTION[location.hash] ?? 'all');

  useEffect(() => {
    const next = HASH_TO_SOLUTION[location.hash];
    if (next) setFilter(next);
  }, [location.hash]);

  const filteredServices = filter === 'all' ? SERVICES : SERVICES.filter(s =>
    Array.isArray(s.solution) ? s.solution.includes(filter) : s.solution === filter
  );

  return (
    <main className="min-h-screen bg-white pb-32 text-gray-800">
      <PageHero titleEn="SERVICE" titleJa="サービス" />

      {/* Full-width Intro Banner Section */}
      <section className="relative w-full overflow-hidden">
        <div className="w-full h-[200px] md:h-[320px]">
          <img
            src="/assets/services/top/service_top_thumbnail.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-24">
            <div className="max-w-[55%] md:max-w-xl relative z-10">
              <p className="text-[11px] md:text-lg font-black text-gray-800 leading-relaxed md:leading-[1.8] tracking-widest md:drop-shadow-md">
                Meta Heroesは、AI人材育成研修やDX教育施設運営、コミュニティ事業を始めとした、さまざまなサービスを展開しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-xl border-y border-gray-100 py-4 md:py-6 mb-12 md:mb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-center">
            <span className="text-[11px] font-black text-gray-400 tracking-[0.2em] w-28 border-r border-gray-100 hidden md:block">ソリューション</span>
            <div className="flex overflow-x-auto scrollbar-hide gap-2 -mx-4 px-4 md:mx-0 md:px-0">
              {SOLUTIONS.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setFilter(sol.id)}
                  className={`px-4 md:px-8 py-2 rounded-full text-[10px] md:text-[11px] font-black tracking-widest transition-all duration-500 whitespace-nowrap flex-shrink-0 ${
                    filter === sol.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100/50 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'
                  }`}
                >
                  {sol.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {filteredServices.map((service) => {
              const CardContent = (
                <motion.div
                  key={service.id}
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
        ) : (
          <div className="py-32 text-center">
            <p className="text-gray-400 font-bold tracking-widest">該当するソリューションが見つかりませんでした</p>
          </div>
        )}
      </div>
    </main>
  );
};
