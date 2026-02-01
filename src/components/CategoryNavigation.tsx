import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { 
    label: '企業情報', 
    iconPath: '/assets/top/company_icon.png', 
    image: '/assets/recruit/about_meta_heroes.png',
    path: '/about'
  },
  { 
    label: 'サービス', 
    iconPath: '/assets/top/service_icon.png', 
    image: '/assets/recruit/services.png',
    path: '/services'
  },
  { 
    label: '採用', 
    iconPath: '/assets/top/recruit_icon.png', 
    image: '/assets/recruit/recruit_top.jpg',
    path: '/recruit'
  },
  { 
    label: 'ブログ', 
    iconPath: '/assets/top/blog_icon.png', 
    image: '/assets/top/business_bg.png',
    path: '/members/blog'
  },
];

export const CategoryNavigation: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {CATEGORIES.map((cat, idx) => (
            <Link key={idx} to={cat.path} className="relative group aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};