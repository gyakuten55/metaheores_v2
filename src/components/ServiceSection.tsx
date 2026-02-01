import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SERVICES = [
  {
    id: 'digital',
    subLabel: 'デジタルソリューション',
    title: 'XR & AI Solutions',
    tags: ['メタバース開発', 'AIシステム開発', 'AI人材育成企業研修'],
    bgImage: '/assets/top/service_bg_xrai.png',
    link: '/services#digital',
    gradient: 'from-blue-600/80 to-cyan-500/40'
  },
  {
    id: 'education',
    subLabel: '教育 × テクノロジー',
    title: 'Technology & Education',
    tags: ['Hero Egg', 'ゲームクリエイター体験会', '防災万博'],
    bgImage: '/assets/top/service_bg_techedu.png',
    link: '/services#social',
    gradient: 'from-emerald-600/80 to-teal-500/40'
  },
  {
    id: 'community',
    subLabel: '共創・コミュニティ',
    title: 'Community & Co-creation',
    tags: ['イベント開催', '講演会', 'オープンイノベーション'],
    bgImage: '/assets/top/service_bg_community.png',
    link: '/services#community',
    gradient: 'from-purple-600/80 to-pink-500/40'
  }
];

export const ServiceSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] block mb-2 uppercase text-gray-400">
            SERVICE
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">サービス</h2>
        </div>
      </div>

      <div className="flex flex-col">
        {SERVICES.map((service) => (
          <Link 
            key={service.id} 
            to={service.link}
            className="group relative w-full h-[250px] md:h-[350px] overflow-hidden flex items-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={service.bgImage} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Default Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
            </div>

            {/* Hover Gradient Overlay - Slides from left */}
            <div className={`absolute inset-0 z-10 bg-gradient-to-r ${service.gradient} translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out`} />

            {/* Content */}
            <div className="container mx-auto px-4 md:px-12 relative z-20 flex justify-between items-center">
              <div className="text-white space-y-2 md:space-y-4">
                <span className="text-xs md:text-sm font-bold tracking-wider block opacity-90">
                  {service.subLabel}
                </span>
                <h3 className="text-2xl md:text-5xl font-black italic tracking-tight">
                  {service.title}
                </h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  {service.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-[10px] md:text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="hidden md:flex w-16 h-16 rounded-full border-2 border-white/30 items-center justify-center text-white group-hover:bg-white group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110">
                <ChevronRight size={32} strokeWidth={3} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
