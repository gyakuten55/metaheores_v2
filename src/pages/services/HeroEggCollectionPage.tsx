import React, { useEffect, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { Link } from 'react-router-dom';
import { getBlogs, Blog } from '../../lib/microcms';
import { ServiceIntroBanner } from '../../components/ServiceIntroBanner';

export const HeroEggCollectionPage: React.FC = () => {
// ... (state and fetch)
  const [news, setNews] = useState<Blog[]>([]);
  const [works, setWorks] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await getBlogs(4, undefined, { categoryId: 'news' });
        setNews(newsData.contents);
        const worksData = await getBlogs(4, undefined, { categoryId: 'case-study' });
        setWorks(worksData.contents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <PageHero 
        titleEn="SOCIAL & EDUCATION" 
        titleJa="Hero Egg COLLECTION"
      />

      <ServiceIntroBanner 
        image="/assets/services/hero-egg-collection/hero-thumbnail.png"
        title="子どもたちの挑戦を支援し、未来の学びと交流の場を生むコミュニティー発表イベント。"
        websiteUrl="#"
      />

      {/* Concept Section - Full Width Gray Background */}
      <section className="bg-gray-50 py-20 md:py-32 mb-32">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-10">
          <div className="flex flex-col items-center">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold leading-relaxed tracking-wider text-gray-900">
              こどもたちの「発想」がビジネスに。アイデアを形にするクリエイティブ<br className="hidden md:block" />
              公募イベント。
            </h2>
            <div className="w-full h-px bg-gray-200 mt-10" />
          </div>
          <p className="text-sm md:text-base text-gray-600 leading-[2.2] font-medium max-w-3xl mx-auto text-justify md:text-center tracking-wide">
            子供たちの自由で大胆なアイデアを、大人が「面白い！」で終わらせずにビジネスの種として採択。社会に実装するプロセスを体験させることで、次世代の起業家精神（アントレプレナーシップ）を育みます。
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl space-y-32">
        
        {/* Key Features */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">KEY FEATURES</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">サービスの特徴</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>
          
          <p className="mb-12 text-gray-600 leading-relaxed font-medium text-sm md:text-base tracking-wide">
            子どもたちのアイデアを大人と共に、ビジネスに変え、形にする環境を揃えております。年齢やスキルに関係なく、誰もが次世代のヒーローになれる可能性を発掘します。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { 
                title: 'アイデアの洗練', 
                icon: '/assets/services/hero-egg-collection/icon-refinement.png', 
                desc: 'プロのクリエイターや起業家が、アイデアを形にするサポート。' 
              },
              { 
                title: 'ピッチ大会', 
                icon: '/assets/services/hero-egg-collection/icon-pitch.png', 
                desc: '自分の考えを大人たちに提案し、評価してもらう場を提供。' 
              },
              { 
                title: '社会実装への道筋', 
                icon: '/assets/services/hero-egg-collection/icon-implementation.png', 
                desc: '優れたアイデアは、パートナー企業と共に商品化を検討。' 
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={`border border-gray-100 rounded-xl p-4 md:p-8 flex flex-col items-center text-center shadow-sm bg-white h-full ${
                  idx === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'
                }`}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-8 flex items-center justify-center">
                  <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                </div>
                <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-3 md:mb-6">{feature.title}</h4>
                <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed md:leading-[1.8] font-medium text-left w-full tracking-wide">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefit */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">BENEFIT</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">期待できる効果</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <p className="mb-12 text-gray-600 leading-relaxed font-medium text-sm md:text-base tracking-wide">
            多世代との交流を通じて、自由な発想を形にする、実践的なビジネス機会が得られます。
          </p>

          <div className="space-y-8">
            {[
              '「自分の考えが社会を変える」という圧倒的な成功体験と自己肯定感',
              '既存の枠にとらわれない、企業側にとってのイノベーションのヒント',
              '論理的思考、プレゼン力、課題解決力が実践を通じて身につく'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-cyan-100 flex items-center justify-center text-cyan-500 font-bold text-xl shadow-[0_4px_10px_rgba(34,211,238,0.2)]">
                  {idx + 1}
                </div>
                <p className="text-base md:text-lg font-bold text-gray-800 tracking-wide">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related News */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">RELATED NEWS</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">関連ニュース</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {news.length > 0 ? news.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="group block">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4 border border-gray-50 shadow-sm">
                  <img 
                    src={item.eyecatch?.url || '/assets/services/hero-egg-collection/hero-thumbnail.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <h4 className="text-xs md:text-sm font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-gray-300 font-bold tracking-widest">{formatDate(item.publishedAt)}</p>
              </Link>
            )) : (
              [1, 2, 3, 4].map((n) => (
                 <div key={n} className="group block animate-pulse">
                  <div className="aspect-video rounded-lg bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/news" className="inline-flex items-center gap-2 px-10 py-3 bg-gray-800 text-white text-xs font-bold rounded-full hover:bg-black transition-colors shadow-md">
              もっと見る
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Case Study & Works */}
        <section id="works">
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">CASE STUDY & WORKS</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">導入事例・実績</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {works.length > 0 ? works.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="group block">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4 border border-gray-50 shadow-sm">
                   <img 
                    src={item.eyecatch?.url || '/assets/services/hero-egg-collection/hero-thumbnail.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <h4 className="text-xs md:text-sm font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-gray-300 font-bold tracking-widest">{formatDate(item.publishedAt)}</p>
              </Link>
            )) : (
              [1, 2, 3, 4].map((n) => (
                 <div key={n} className="group block animate-pulse">
                  <div className="aspect-video rounded-lg bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/works" className="inline-flex items-center gap-2 px-10 py-3 bg-gray-800 text-white text-xs font-bold rounded-full hover:bg-black transition-colors shadow-md">
              もっと見る
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer CTA Section */}
      <section className="bg-gray-50 mt-32">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
            <Link
              to="/document-request"
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#333333] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">Discord参加</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </Link>
            
            <Link
              to="/document-request"
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#3b82f6] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">資料請求</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </Link>

            <Link
              to="/contact"
              
              
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#0ea5e9] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">お問い合わせ</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
