import React from 'react';
import { PageHero } from '../components/PageHero';

const GROUP_COMPANIES = [
  {
    name: '株式会社Meta Osaka',
    logo: '/assets/group/MO_logo_alpha.png',
    url: 'https://www.meta-osaka.co.jp/'
  },
  {
    name: '株式会社MetaEarthHeroes',
    logo: '/assets/group/META EARTH HEROES_LogoFont.png',
    url: 'https://www.metaearth.co.jp/'
  }
];

export const GroupCompaniesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="GROUP COMPANIES" 
        titleJa="グループ会社"
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GROUP_COMPANIES.map((company, idx) => (
            <a 
              key={idx} 
              href={company.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-4 md:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="flex-grow flex items-center justify-center mb-4 w-full aspect-[3.5/1]">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="max-w-[60%] max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-center gap-2">
                <span className="text-[11px] md:text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors tracking-tighter">
                  {company.name}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-gray-300 group-hover:text-blue-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};