import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { 
    label: '企業情報', 
    iconPath: '/assets/top/企業情報_icon.png', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    path: '/about'
  },
  { 
    label: 'サービス', 
    iconPath: '/assets/top/サービス_icon.png', 
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
    path: '#' // Update if service page exists
  },
  { 
    label: '採用', 
    iconPath: '/assets/top/採用情報_icon.png', 
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800',
    path: '#' // Update if recruitment page exists
  },
  { 
    label: 'ブログ', 
    iconPath: '/assets/top/ブログ_icon.png', 
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800',
    path: '/news'
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