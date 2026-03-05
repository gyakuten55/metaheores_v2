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
          <li>施設運営事業</li>
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
    <main className="min-h-screen bg-white pb-20 md:pb-32">
      <PageHero 
        titleEn="COMPANY OVERVIEW" 
        titleJa="会社概要"
      />

      <div className="container mx-auto px-6 md:px-4 max-w-4xl">
        <div className="border-t border-gray-100">
          {profileData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-row py-8 md:py-12 border-b border-gray-100 gap-0"
            >
              <div className="w-1/3">
                <h3 className="text-sm font-black text-gray-400 md:text-gray-800 tracking-widest uppercase md:normal-case">
                  {item.label}
                </h3>
              </div>
              <div className="w-2/3">
                <div className="text-base md:text-lg font-medium text-gray-700 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps Section */}
        <div className="mt-16 md:mt-24">
          <h3 className="text-sm font-black text-gray-400 tracking-widest mb-6 uppercase">Access Map</h3>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.106828956662!2d135.5019299763756!3d34.70248538313463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e693967d6c69%3A0x6336a337c76378f7!2z44CSNTMwLTAwMjcg5aSn6Ziq5bqc5aSn6Ziq5biC5YyX5Yy65aCC5bGx55S677yR4oiS77yV!5e0!3m2!1sja!2sjp!4v1709620000000!5m2!1sja!2sjp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="大阪本社"
            />
          </div>
          <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-blue-500">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <p>大阪メトロ谷町線「中崎町駅」より徒歩5分 / 大阪メトロ御堂筋線「梅田駅」より徒歩8分</p>
          </div>
        </div>
      </div>
    </main>
  );
};