import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  titleEn: string;
  titleJa: string;
  subText?: string;
  backgroundImage?: string;
  isFullHeight?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({ 
  titleEn, 
  titleJa, 
  subText, 
  backgroundImage,
  isFullHeight = false
}) => {
  return (
    <section 
      className={`relative flex items-center justify-center overflow-hidden ${
        isFullHeight ? 'h-[80vh] min-h-[600px]' : 'pt-40 pb-20 md:pt-48 md:pb-24'
      } ${!backgroundImage ? 'bg-white' : ''}`}
    >
      {/* Background Image & Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt={titleEn} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* English Category Label */}
          <span className={`text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-4 ${
            backgroundImage ? 'text-white/80' : 'text-gray-400'
          }`}>
            {titleEn}
          </span>
          
          {/* Main Titles */}
          <div className="flex flex-col items-center gap-6">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              backgroundImage ? 'text-white drop-shadow-2xl' : 'text-gray-900'
            }`}>
              {titleJa}
            </h1>
            
            {/* Gradient Underline */}
            <div className={`w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 ${
              backgroundImage ? 'shadow-lg shadow-cyan-500/50' : ''
            }`} />

            {subText && (
              <p className={`text-base md:text-lg font-bold tracking-[0.1em] mt-2 ${
                backgroundImage ? 'text-white opacity-90' : 'text-gray-500'
              }`}>
                {subText}
              </p>
            )}
          </div>

          {/* Scroll Indicator for full-height heroes */}
          {isFullHeight && (
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12"
            >
              <div className={`w-[1px] h-16 mx-auto ${
                backgroundImage ? 'bg-gradient-to-b from-cyan-400 to-transparent' : 'bg-gradient-to-b from-blue-600 to-transparent'
              }`} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};