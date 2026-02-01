import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BUSINESS_ITEMS = [
  {
    id: 'metaverse',
    titleJa: 'メタバース',
    titleEn: 'Metaverse',
    image: '/assets/business-content/metaverce/metaverse_hero.png',
    logo: '/assets/top/meta_heroes_creative_logo.png',
    link: '/business',
    align: 'left'
  },
  {
    id: 'ai',
    titleJa: 'AI',
    titleEn: 'Artificial Intelligence',
    image: '/assets/business-content/ai/ai_hero.png',
    logo: '/assets/top/AIH.png',
    link: '/business',
    align: 'right'
  },
  {
    id: 'event',
    titleJa: 'イベント',
    titleEn: 'Event',
    image: '/assets/business-content/event/event_hero.png',
    logo: '/assets/top/ghs_logo.png',
    link: '/business',
    align: 'left'
  },
  {
    id: 'vacant',
    titleJa: '施設運営事業',
    titleEn: 'Facility management',
    image: '/assets/business-content/vacant-facility/vacant_hero.png',
    logo: '/assets/top/hero_egg_yoko.png',
    link: '/business',
    align: 'right'
  }
];

export const BusinessContentSection: React.FC = () => {
  return (
    <section className="relative pt-12 md:pt-24 pb-32 md:pb-64 overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] block mb-2 uppercase text-gray-400">
            BUSINESS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">事業内容</h2>
        </div>

        {/* List */}
        <div className="flex flex-col gap-12 md:gap-16">
          {BUSINESS_ITEMS.map((item) => (
            <div key={item.id} className="relative">
              <div className={`flex flex-col md:flex-row items-center ${
                item.align === 'right' ? 'md:flex-row-reverse' : ''
              }`}>
                
                {/* Text & Logo Area */}
                <div className="w-full md:w-1/2 flex flex-col z-10 relative py-8 will-change-transform">
                  <motion.div
                    initial={{ opacity: 0, x: item.align === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className={`flex flex-col mb-4 ${
                      item.align === 'left' ? 'md:items-end md:pr-10 text-center md:text-right' : 'md:items-start md:pl-10 text-center md:text-left'
                    }`}
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{item.titleJa}</h3>
                    <span className="text-xs md:text-sm font-medium text-gray-500 tracking-wide">{item.titleEn}</span>
                  </motion.div>

                  {/* Logo Banner Space Holder */}
                  <div className="h-12 md:h-16" />

                  {/* Service Logo (Above Line) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`absolute bottom-12 md:bottom-16 z-30 px-4 w-full flex ${
                      item.align === 'left' ? 'md:justify-end md:pr-10' : 'md:justify-start md:pl-10'
                    } justify-center`}
                  >
                    <img 
                      src={item.logo} 
                      alt={`${item.titleJa} logo`} 
                      loading="lazy"
                      className="h-8 md:h-10 w-auto object-contain max-w-[180px]"
                    />
                  </motion.div>

                  {/* Actual Horizontal Line (Absolute) */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`absolute bottom-8 h-[8px] bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg flex items-center z-20
                      w-[100vw] left-[calc(50%-50vw)] origin-center
                      md:w-[100vw] will-change-transform
                      ${item.align === 'left' 
                        ? 'md:left-auto md:right-0 md:origin-right md:rounded-l-full' 
                        : 'md:right-auto md:left-0 md:origin-left md:rounded-r-full'
                      }
                    `}
                  />
                </div>

                {/* Image Area */}
                <div className="w-full md:w-1/2 px-4 md:px-0 z-20 will-change-transform">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link to={item.link} className="block group relative rounded-2xl overflow-hidden shadow-2xl border border-white aspect-[16/9]">
                      <img
                        src={item.image}
                        alt={item.titleJa}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    </Link>
                  </motion.div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
