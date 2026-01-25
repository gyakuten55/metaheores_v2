import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BUSINESS_ITEMS = [
  {
    id: 'metaverse',
    titleJa: 'メタバース',
    titleEn: 'Metaverse',
    image: '/assets/business-content/metaverce/metaverse_hero.png',
    logo: '/assets/top/MetaHeroesCreative_logo_B.png',
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
    logo: '/assets/top/GHS_logo_black_A.png',
    link: '/business',
    align: 'left'
  },
  {
    id: 'vacant',
    titleJa: '施設運営',
    titleEn: 'Facility management',
    image: '/assets/business-content/vacant-facility/vacant_hero.png',
    logo: '/assets/top/Hero Egg_yoko.png',
    link: '/business',
    align: 'right'
  }
];

export const BusinessContentSection: React.FC = () => {
  return (
    <section className="relative pt-12 md:pt-24 pb-32 md:pb-64 overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/top/business_bg.png"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        {/* Overlay gradient for better text visibility if needed */}
        <div className="absolute inset-0 bg-slate-900/20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 text-white">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] block mb-2 uppercase opacity-80">
            BUSINESS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">事業内容</h2>
        </div>

        {/* List */}
        <div className="flex flex-col gap-12 md:gap-16">
          {BUSINESS_ITEMS.map((item) => (
            <div key={item.id} className="relative">
              <div className={`flex flex-col md:flex-row items-center ${
                item.align === 'right' ? 'md:flex-row-reverse' : ''
              }`}>
                
                {/* Text & Logo Area */}
                <div className="w-full md:w-1/2 flex flex-col z-10 relative py-8">
                  <motion.div
                    initial={{ opacity: 0, x: item.align === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col mb-4 ${
                      item.align === 'left' ? 'md:items-end md:pr-10 text-center md:text-right' : 'md:items-start md:pl-10 text-center md:text-left'
                    }`}
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{item.titleJa}</h3>
                    <span className="text-xs md:text-sm font-light text-gray-300 tracking-wide">{item.titleEn}</span>
                  </motion.div>

                  {/* Logo Banner Space Holder */}
                  <div className="h-16 md:h-20" />

                  {/* Actual Logo Banner (Absolute) */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`absolute bottom-8 h-16 md:h-20 bg-white shadow-xl flex items-center z-30
                      w-[100vw] left-[calc(50%-50vw)] justify-center origin-center
                      md:w-[100vw]
                      ${item.align === 'left' 
                        ? 'md:left-auto md:right-0 md:origin-right md:justify-end md:pr-10 md:pl-0 md:rounded-l-full' 
                        : 'md:right-auto md:left-0 md:origin-left md:justify-start md:pl-10 md:pr-0 md:rounded-r-full'
                      }
                    `}
                  >
                    {/* Logo Container */}
                    <div className={`flex items-center h-full px-4`}>
                      <img 
                        src={item.logo} 
                        alt={`${item.titleJa} logo`} 
                        className="h-7 md:h-9 w-auto object-contain max-w-[180px]"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Image Area */}
                <div className="w-full md:w-1/2 px-4 md:px-0 z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Link to={item.link} className="block group relative rounded-2xl overflow-hidden shadow-2xl border border-white aspect-[16/9]">
                      <img
                        src={item.image}
                        alt={item.titleJa}
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
