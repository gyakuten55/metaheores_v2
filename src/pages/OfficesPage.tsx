import React from 'react';
import { PageHero } from '../components/PageHero';

const OFFICE_DATA = [
  {
    en: 'MAIN OFFICE',
    title: '本社',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.123456789!2d135.502!3d34.702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e691ec666667%3A0x6666666666666666!2z44CSNTMwLTAwMjcg5aSn6Ziq5bqc5aSn6Ziq5biC5YyX5Yy65aCC5bGx55S677yR4oiS77yV!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp',
    address: '〒530-0027\n大阪府大阪市北区堂山町1-5\n三共梅田ビル8F',
    access: [
      '大阪メトロ谷町線「中崎町駅」より徒歩6分。',
      '大阪メトロ御堂筋線「梅田駅」より徒歩8分。',
      '大阪メトロ堺筋線「扇町駅」より徒歩6分。',
      '阪急電鉄「大阪梅田駅」より徒歩10分。',
      'JR「大阪駅」より徒歩11分。'
    ],
    image: '/assets/offices/head_office.png',
    actualMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.1143211111!2d135.50211111111!3d34.70211111111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e691ec666667%3A0x6666666666666666!2z5LiJ5YWx5 Wilfred55Sw44OT44Or!5e0!3m2!1sja!2sjp!4v1704450000000!5m2!1sja!2sjp'
  },
  {
    en: 'HERO EGG | DX EDUCATION FACILITY',
    title: 'DX教育施設「Hero Egg」',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.23456789!2d135.501!3d34.664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e76666666667%3A0x7777777777777777!2z44CSNTU2LTAwMTEg5aSn6Ziq5bqc5aSn6Ziq5biC5rWq6YCf5Yy66Zuj5rOi5Lit77yS5LiB55uu77yR77yQ4oiS77yX77yQ!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp',
    address: '〒556-0011\n大阪府大阪市浪速区難波中2丁目10-70\nなんばパークス1階',
    access: [
      '大阪メトロ御堂筋線「なんば駅」より徒歩7分。',
      '大阪メトロ千日前線「なんば駅」より徒歩10分。',
      '大阪メトロ四つ橋線「なんば駅」より徒歩15分。',
      '阪神なんば線「大阪難波駅」より徒歩10分。',
      '近鉄難波線(奈良線)「大阪難波駅」より徒歩10分。',
      'JR関西本線(大和路線)「JR難波駅」(OCAT)北出口より徒歩15分。'
    ],
    image: '/assets/offices/heroegg.png',
    actualMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.2741!2d135.5012!3d34.6641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e769cd000001%3A0x6666666666666666!2z44Gq44KT44Gw44OR44O844Kv44K5!5e0!3m2!1sja!2sjp!4v1704450000000!5m2!1sja!2sjp'
  },
  {
    en: 'META HEROES GUILD | COMMUNITY SPACE',
    title: 'コミュニティスペース「Meta Heroes Guild」',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.123456789!2d135.502!3d34.701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e691ec666667%3A0x8888888888888888!2z44CSNTMwLTAwNTEg5aSn6Ziq5bqc5aSn6Ziq5biC5YyX5Yy65aSq6J6N5a-655S677yY4oiS77yR77yX!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp',
    address: '〒530-0051\n大阪府大阪市北区太融寺町8-17\nプラザ梅田ビルB1F',
    access: [
      '大阪メトロ谷町線「中崎町駅」より徒歩8分。',
      '大阪メトロ御堂筋線「梅田駅」より徒歩8分。',
      '大阪メトロ四つ橋線「扇町駅」より徒歩12分。',
      '阪急電鉄「大阪梅田駅」より徒歩8分。',
      'JR「大阪駅」より徒歩9分。'
    ],
    image: '/assets/offices/community_space.png',
    actualMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.1541!2d135.5022!3d34.7011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e691ec666667%3A0x9999999999999999!2z44OX44Op44K25 Wilfred55Sw44OT44Or!5e0!3m2!1sja!2sjp!4v1704450000000!5m2!1sja!2sjp'
  }
];

// Use more reliable query-based map embed URLs to ensure markers are visible
const MAP_EMBED_URLS = [
  // 本社 (三共梅田ビル)
  "https://maps.google.com/maps?q=大阪府大阪市北区堂山町1-5%20三共梅田ビル&t=&z=15&ie=UTF8&iwloc=&output=embed",
  // Hero Egg (なんばパークス)
  "https://maps.google.com/maps?q=大阪府大阪市浪速区難波中2丁目10-70%20なんばパークス&t=&z=15&ie=UTF8&iwloc=&output=embed",
  // Meta Heroes Guild (プラザ梅田ビル)
  "https://maps.google.com/maps?q=大阪府大阪市北区太融寺町8-17%20プラザ梅田ビル&t=&z=15&ie=UTF8&iwloc=&output=embed"
];

export const OfficesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="BUSINESS OFFICES AND FACILITIES" 
        titleJa="事業所・施設"
      />

      <div className="container mx-auto px-4 max-w-5xl space-y-32">
        {OFFICE_DATA.map((office, idx) => (
          <section key={idx}>
            {/* Section Title */}
            <div className="mb-12">
              <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-3">
                {office.en}
              </span>
              <div className="flex flex-col items-start">
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                  {office.title}
                </h2>
                <div className="w-full h-px bg-gray-100 relative mt-6">
                  <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
            </div>

                        {/* Visual Grid: Map and Photo */}
                        <div className="flex flex-col md:flex-row gap-4 mb-12 h-auto md:h-[400px]">
                          {/* Map - Wider (approx 65%) */}
                          <div className="w-full md:w-[65%] h-[300px] md:h-full rounded-sm overflow-hidden shadow-sm border border-gray-100">
                            <iframe 
                              src={MAP_EMBED_URLS[idx]} 
                              width="100%" 
                              height="100%" 
                              style={{ border: 0 }} 
                              allowFullScreen={true} 
                              loading="lazy" 
                              referrerPolicy="no-referrer-when-downgrade"
                              title={`${office.title} Map`}
                            ></iframe>
                          </div>
                          {/* Photo - Narrower and Vertical (approx 35%) */}
                          <div className="w-full md:w-[35%] h-[300px] md:h-full rounded-sm overflow-hidden shadow-sm">
                            <img src={office.image} alt={office.title} className="w-full h-full object-cover" />
                          </div>
                        </div>
            {/* Info Content */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12 max-w-3xl">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-800 border-b border-gray-100 pb-2 inline-block mb-4">所在地</h3>
                <p className="text-base font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                  {office.address}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-800 border-b border-gray-100 pb-2 inline-block mb-4">アクセス</h3>
                <ul className="space-y-2">
                  {office.access.map((item, i) => (
                    <li key={i} className="text-base font-medium text-gray-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
