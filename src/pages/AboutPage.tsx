import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { AboutNavigation } from '../components/AboutNavigation';
import { AboutStatsSection } from '../components/AboutStatsSection';

export const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <PageHero 
        titleEn="Company information" 
        titleJa="企業情報"
      />
      
      {/* CEO Banner Section */}
      <section className="relative w-full overflow-hidden bg-white">
        {/* Base Image */}
        <div className="w-full h-auto min-h-[280px] md:min-h-0 relative">
          <img 
            src="/assets/about/ceo_hero.png" 
            alt="CEO 松石 和俊" 
            className="w-full h-full object-cover object-top md:h-auto absolute inset-0 md:relative"
          />
        </div>

        {/* Overlay Text Content - Middle Left for both mobile and PC */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-24">
            <div className="max-w-md relative z-10">
              <p className="text-[10px] md:text-sm font-bold text-gray-500 mb-1 md:mb-2">代表取締役社長CEO</p>
              <h2 className="text-xl md:text-5xl font-black text-gray-800 mb-2 md:mb-8 tracking-tighter">
                松石 和俊
              </h2>
              <div className="space-y-0 md:space-y-1 mb-4 md:mb-10">
                <p className="text-[13px] md:text-xl font-bold text-gray-800 leading-tight">
                  Society 5.0/SDGsを目指す
                </p>
                <p className="text-[13px] md:text-xl font-bold text-gray-800 leading-tight">
                  株式会社Meta Heroesの挑戦
                </p>
              </div>
              <Link 
                to="/ceo-message" 
                className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2 md:py-3 bg-[#333] text-white text-[9px] md:text-sm font-bold rounded-full hover:bg-black transition-all group"
              >
                CEOからのメッセージ
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform">
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path stroke="url(#arrowGradient)" strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Navigation Buttons */}
      <AboutNavigation />

      {/* Stats Section */}
      <AboutStatsSection />
    </main>
  );
};