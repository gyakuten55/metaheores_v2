import React from 'react';
import { PageHero } from '../components/PageHero';

export const CompanyProfilePage: React.FC = () => {
  const profileData = [
    { label: '会社名', content: '株式会社Meta Heroes' },
    { label: '代表者', content: '松石 和俊' },
    { label: '設立日', content: '2021年12月3日' },
    { label: '資本金', content: '4100万円' },
    { 
      label: '大阪本社', 
      content: (
        <div className="space-y-1">
          <p>〒530-0027</p>
          <p>大阪府大阪市北区堂山町1-5</p>
          <p>三共梅田ビル8F</p>
        </div>
      )
    },
    { 
      label: '施設運営', 
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-block bg-gray-100 px-4 py-1.5 rounded-full text-sm font-bold text-gray-700">
              DX教室 Hero Egg
            </span>
            <div className="space-y-1 pl-1">
              <p>〒556-0011</p>
              <p>大阪府大阪市浪速区難波中2丁目10-70</p>
              <p>なんばパークス1階</p>
            </div>
          </div>
          <div className="space-y-3">
            <span className="inline-block bg-gray-100 px-4 py-1.5 rounded-full text-sm font-bold text-gray-700">
              コミュニティスペース Meta Heroes Guild
            </span>
            <div className="space-y-1 pl-1">
              <p>〒530-0051</p>
              <p>大阪府大阪市北区太融寺町8-17</p>
              <p>梅田ビルB1F</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      label: '事業内容', 
      content: (
        <ul className="space-y-1">
          <li>メタバース事業</li>
          <li>AI事業</li>
          <li>イベント事業</li>
          <li>空きスペース活用事業</li>
        </ul>
      )
    },
    { 
      label: 'グループ企業', 
      content: (
        <div className="space-y-2">
          <a 
            href="https://www.meta-osaka.co.jp/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            株式会社Meta Osaka
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <a 
            href="https://www.metaearth.co.jp/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            株式会社MetaEarthHeroes
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      )
    },
  ];

  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="COMPANY OVERVIEW" 
        titleJa="会社概要"
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="border-t border-gray-100">
          {profileData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row py-10 md:py-12 border-b border-gray-100 gap-4 md:gap-0"
            >
              <div className="w-full md:w-1/3">
                <h3 className="text-sm md:text-base font-black text-gray-800 tracking-wider">
                  {item.label}
                </h3>
              </div>
              <div className="w-full md:w-2/3">
                <div className="text-sm md:text-base font-medium text-gray-600 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};