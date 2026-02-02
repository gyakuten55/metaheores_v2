import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { allMembers } from '../data/members';
import { Blog, getMemberBlogs } from '../lib/microcms';

interface JobCategory {
  id: string;
  title: string;
  description?: string;
  positions?: string[];
  link?: string;
}

const RECRUITMENT_TYPES: JobCategory[] = [
  {
    id: 'metaverse',
    title: 'メタバース・ゲーム',
    description: `Meta Heroesのメタバース・ゲームの開発に関わるポジションです。

クリエイティブで社会課題解決に興味・関心のある方を募集中です。年間で複数のプロジェクトに関わることができます。`,
    positions: ['ディレクター', 'アートディレクター', 'プロジェクトマネージャー'],
    link: '#'
  },
  { id: 'ai', title: 'AI' },
  { id: 'sales', title: 'セールス' },
  { id: 'event', title: 'イベント' },
  { id: 'heroegg', title: 'Hero Egg' },
  { id: 'corporate', title: 'コーポレート' },
];

const SELECTION_PROCESS = [
  {
    step: 1,
    title: '書類選考',
    description: ['簡単な経歴の確認']
  },
  {
    step: 2,
    title: '面談（複数回）',
    description: [
      '会社紹介と応募者様とのMeta Heroesカルチャーおよびスキルの擦り合わせ',
      '質疑応答'
    ]
  },
  {
    step: 3,
    title: '課題',
    description: [
      'チームごとに定めた課題を応募者様に依頼',
      '課題の発表と質疑応答'
    ]
  },
  {
    step: 4,
    title: '最終面談',
    description: ['最終はCEOの松石が出席']
  }
];

export const RecruitPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>('metaverse');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const memberScrollRef = useRef<HTMLDivElement>(null);
  const blogScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show 'Under Construction' notification and redirect
    alert('採用情報は現在準備中です。最新の募集情報はIndeedをご確認ください。');
    window.location.href = '/';

    const fetchBlogs = async () => {
      try {
        const response = await getMemberBlogs(8);
        setBlogs(response.contents);
      } catch (error) {
        console.error('Failed to fetch member blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const scrollMembers = (direction: 'left' | 'right') => {
    if (memberScrollRef.current) {
      const { scrollLeft, clientWidth } = memberScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      memberScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const scrollBlogs = (direction: 'left' | 'right') => {
    if (blogScrollRef.current) {
      const { scrollLeft, clientWidth } = blogScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      blogScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white pb-0">
      <PageHero 
        titleEn="RECRUIT" 
        titleJa="採用情報"
      />

      {/* Video Section */}
      <div className="w-full">
        <video 
          src="/assets/recruit/brand-movie.mp4" 
          className="w-full h-auto" 
          autoPlay 
          muted 
          loop 
          playsInline 
        />
      </div>

      {/* Message Section */}
      <section id="message" className="relative w-full py-24 md:py-40 flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/recruit/message.png" 
            alt="Message" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-primary-blue mb-6 tracking-wider">
              100人のHEROを、ここから
            </h2>
            
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl font-black text-black tracking-widest leading-tight">
                その志で、未来を創ろう。
              </h3>
              
              <div className="text-[15px] md:text-base font-bold text-black leading-[2] tracking-[0.1em] space-y-1">
                <p>性格も、能力もバラバラでいい。むしろ、それがいい。</p>
                <p>顧客を感動させる人。</p>
                <p>チームのピンチを救う人。</p>
                <p>新しい技術で社会を変える人。</p>
                <p>それぞれが自分の得意分野で、誰にも負けないHEROに。</p>
                <p>100人がそれぞれの場所で輝く時、未来はもっと面白くなる。</p>
                <p className="pt-4">さあ、その志で、あなたはどんな未来を創りますか。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Section */}
      <section id="corporate" className="py-12 md:py-32 bg-white w-full overflow-hidden">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-0">
            {/* Left Column */}
            <div className="flex flex-col items-start">
              <div className="w-full h-32 md:h-[23.81vw] pr-4 md:pr-16 flex flex-col justify-center items-end">
                <h2 className="text-2xl md:text-6xl font-black text-primary-blue mb-1 md:mb-2 tracking-tight">Corporate</h2>
                <p className="text-[10px] md:text-sm font-bold text-gray-600 tracking-widest">会社を知る</p>
              </div>
              
              <div className="w-full self-start rounded-r-2xl md:rounded-r-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/company" className="group relative block w-full">
                  <div className="aspect-[4/3] md:aspect-[21/10] w-full bg-gray-50">
                    <img 
                      src="/assets/recruit/about_meta_heroes.png" 
                      alt="Meta Heroesについて" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 right-4 md:bottom-8 md:right-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">Meta Heroesについて</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-end">
              <div className="w-full rounded-l-2xl md:rounded-l-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/mission" className="group relative block w-full">
                  <div className="aspect-[4/3] md:aspect-[21/10] w-full bg-gray-50">
                    <img 
                      src="/assets/recruit/mission.png" 
                      alt="Meta Heroesの使命" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 left-4 md:bottom-8 md:left-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">Meta Heroesの使命</span>
                  </div>
                </Link>
              </div>

              <div className="hidden md:block w-full h-[23.81vw]" />

              <div className="w-full rounded-l-2xl md:rounded-l-[40px] overflow-hidden shadow-xl md:shadow-2xl mt-4 md:mt-0">
                <Link to="/ceo-message" className="group relative block w-full">
                  <div className="aspect-[4/3] md:aspect-[21/10] w-full bg-gray-50">
                    <img 
                      src="/assets/recruit/ceo_message.png" 
                      alt="代表メッセージ" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-3 left-4 md:bottom-8 md:left-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">代表メッセージ</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Content Section */}
      <section id="business" className="pt-12 md:pt-20 pb-0 bg-gradient-to-r from-blue-500 to-cyan-400 w-full">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-center mb-12">
            <span className="bg-white text-black text-lg font-bold px-16 py-3 rounded-full shadow-lg tracking-widest">
              事業内容
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            <Link to="/business#metaverse" className="group flex flex-col h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white py-1.5 md:py-4 text-center border-b border-gray-100">
                <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-lg">メタバース事業</span>
              </div>
              <div className="relative aspect-square md:aspect-[9/16] w-full overflow-hidden bg-gray-200">
                <img src="/assets/recruit/metaverse.png" alt="メタバース事業" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </Link>
            <Link to="/business#ai" className="group flex flex-col h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white py-1.5 md:py-4 text-center border-b border-gray-100">
                <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-lg">AI事業</span>
              </div>
              <div className="relative aspect-square md:aspect-[9/16] w-full overflow-hidden bg-gray-200">
                <img src="/assets/recruit/ai_business.png" alt="AI事業" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </Link>
            <Link to="/business#event" className="group flex flex-col h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white py-1.5 md:py-4 text-center border-b border-gray-100">
                <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-lg">イベント事業</span>
              </div>
              <div className="relative aspect-square md:aspect-[9/16] w-full overflow-hidden bg-gray-200">
                <img src="/assets/recruit/event_business.png" alt="イベント事業" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </Link>
            <Link to="/business#facility" className="group flex flex-col h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white py-1.5 md:py-4 text-center border-b border-gray-100">
                <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-lg">空きスペース事業</span>
              </div>
              <div className="relative aspect-square md:aspect-[9/16] w-full overflow-hidden bg-gray-200">
                <img src="/assets/recruit/vacant_facility.png" alt="空きスペース事業" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-12 md:py-32 bg-white w-full">
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-24">
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/company" className="group relative block w-full">
                  <div className="aspect-[16/9] w-full bg-gray-50">
                    <img src="/assets/recruit/services.png" alt="数字で見るMeta Heroes" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-3 right-4 md:bottom-8 md:right-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10 text-center">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">数字で見るMeta Heroes</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full mb-6 md:mb-16 mt-0 md:mt-0 flex flex-col items-end">
                <h2 className="text-2xl md:text-6xl font-black text-blue-600 mb-1 md:mb-2 tracking-tight">Work</h2>
                <p className="text-[10px] md:text-sm font-bold text-gray-600 tracking-widest">働き方を知る</p>
              </div>

              <div className="w-full md:mt-12 rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/offices" className="group relative block w-full">
                  <div className="aspect-[16/9] w-full bg-gray-50">
                    <img src="/assets/recruit/offices.png" alt="オフィス・施設" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-3 left-4 md:bottom-8 md:left-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10 text-center">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">オフィス・施設</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Type Section */}
      <section id="recruitment-type" className="py-20 md:py-32 bg-gray-50 w-full">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="mb-16">
            <span className="text-xs font-bold text-gray-400 tracking-wider block mb-2">RECRUITMENT TYPE</span>
            <h2 className="text-3xl font-black text-gray-900 pb-2 inline-block border-b-[3px] border-blue-400">
              募集職種
            </h2>
            <div className="mt-8 space-y-2">
              <p className="text-sm font-bold text-gray-600">現在募集している職種一覧</p>
              <p className="text-xs text-gray-500">※求人ページが存在しない求人は現在、求人を行っておりません。</p>
            </div>
          </div>

          <div className="border-t border-gray-300">
            {RECRUITMENT_TYPES.map((type) => {
              const isOpen = openCategory === type.id;
              return (
                <div key={type.id} className="border-b border-gray-300">
                  <button onClick={() => toggleCategory(type.id)} className="w-full py-6 flex items-center justify-between group transition-colors hover:bg-gray-100/50">
                    <span className="text-lg font-black text-gray-800 tracking-wide">{type.title}</span>
                    <span className="text-2xl font-light text-gray-400 transition-all duration-300">{isOpen ? '－' : '＋'}</span>
                  </button>
                  <div className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-2 pb-4 px-2 md:px-4">
                      {type.description && <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line mb-8">{type.description}</p>}
                      {type.positions && (
                        <div className="flex flex-col gap-3 mb-8">
                          {type.positions.map((pos) => (
                            <div key={pos} className="inline-flex">
                              <span className="px-8 py-3 border border-gray-400 text-sm font-bold text-gray-800 rounded bg-white min-w-[240px] text-center">{pos}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {type.link && (
                        <Link to="/members" className="inline-flex items-center gap-2 group">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                          </div>
                          <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">チームメンバー紹介</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-12 md:py-32 bg-white w-full overflow-hidden">
        <div className="w-full">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-6xl font-black text-blue-600 mb-1 md:mb-2 tracking-tight">Culture</h2>
            <p className="text-[10px] md:text-sm font-bold text-gray-600 tracking-widest">カルチャーを知る</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-0">
            <div className="w-full flex justify-start">
              <div className="w-full md:w-[85%] rounded-r-2xl md:rounded-r-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/company" className="group relative block w-full">
                  <div className="aspect-[21/9] w-full bg-gray-50">
                    <img src="/assets/recruit/HR100.png" alt="HR100" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-3 right-4 md:bottom-8 md:right-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10 text-center">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">HR100</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="w-full flex justify-end mt-0 md:mt-0">
              <div className="w-full md:w-[85%] rounded-l-2xl md:rounded-l-[40px] overflow-hidden shadow-xl md:shadow-2xl">
                <Link to="/about/conduct" className="group relative block w-full">
                  <div className="aspect-[21/9] w-full bg-gray-50">
                    <img src="/assets/recruit/credo.png" alt="10のHEROクレド" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-3 left-4 md:bottom-8 md:left-12 bg-white px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-md z-10 text-center">
                    <span className="text-[10px] md:text-sm font-black text-gray-800 tracking-wider">10のHEROクレド</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People Section */}
      <section id="people" className="py-20 md:py-32 bg-gray-50 w-full overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-blue-600 mb-2 tracking-tight">People</h2>
            <p className="text-sm font-bold text-gray-600 tracking-widest uppercase">メンバーを知る</p>
          </div>

          <div className="relative mb-32 group">
            <div ref={memberScrollRef} className="flex gap-4 md:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {allMembers.map((member) => (
                <Link key={member.id} to={`/member/${member.id}`} className="group/card block flex-shrink-0 w-[160px] md:w-[calc(25%-30px)] snap-start">
                  <div className="aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-lg mb-4 md:mb-6 transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-2xl">
                    <img src={member.icon} alt={member.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/card:grayscale-0 group-hover/card:scale-110" />
                  </div>
                  <div className="px-2">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1">{member.name}</h3>
                    <p className="text-[9px] md:text-xs font-bold text-blue-500 tracking-wider uppercase mb-1.5 md:mb-2">{member.nameEn}</p>
                    <p className="text-[9px] md:text-xs text-gray-400 font-bold border-t border-gray-100 pt-1.5 md:pt-2 inline-block pr-4">{member.role}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollMembers('left')} className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all z-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
            <button onClick={() => scrollMembers('right')} className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all z-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
          </div>

          <div id="blog" className="mt-32">
            <div className="flex justify-center mb-16">
              <span className="bg-[#2563eb] text-white text-lg font-bold px-24 py-2.5 rounded-full shadow-lg tracking-widest">
                ブログ
              </span>
            </div>

            <div className="relative">
              <div ref={blogScrollRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/member-blog/${blog.id}`} className="group/blog block flex-shrink-0 w-[80%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[16/10] overflow-hidden">
                      {blog.eyecatch ? (
                        <img src={blog.eyecatch.url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/blog:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center"><span className="text-white text-2xl font-black">MH</span></div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col h-[140px]">
                      <h3 className="text-[13px] font-bold text-gray-800 line-clamp-3 leading-relaxed flex-grow">
                        {blog.title}
                      </h3>
                      <div className="mt-auto pt-3 border-t border-gray-100">
                    <time className="text-[11px] font-bold text-blue-500 font-mono tracking-wider">
                      {formatDate(blog.publishedAt)}
                    </time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <button onClick={() => scrollBlogs('left')} className="absolute left-[-10px] md:left-[-20px] lg:left-[-40px] top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scrollBlogs('right')} className="absolute right-[-10px] md:right-[-20px] lg:right-[-40px] top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/members/blog" className="text-[11px] font-bold text-gray-400 hover:text-blue-600 transition-colors tracking-widest border-b border-gray-200 hover:border-blue-600 pb-1 uppercase">View All</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Process Section */}
      <section id="selection-process" className="py-20 md:py-32 bg-white w-full">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="mb-12">
            <span className="text-xs font-bold text-gray-400 tracking-wider block mb-2 uppercase">Selection Process</span>
            <h2 className="text-3xl font-black text-gray-900 pb-2 inline-block border-b-[3px] border-blue-400">
              選考プロセス
            </h2>
            <p className="mt-8 text-sm font-bold text-gray-600">
              面談および課題を通じて、カルチャーとスキルの相性をお互い確認させていただきます。
            </p>
          </div>

          <div className="relative mt-20 ml-4 md:ml-12">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-cyan-300 -z-10" />
            <div className="space-y-12">
              {SELECTION_PROCESS.map((item) => (
                <div key={item.step} className="flex items-start gap-6 md:gap-12 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg flex flex-col items-center justify-center text-white">
                    <span className="text-[10px] font-black leading-none mb-0.5 uppercase">Step</span>
                    <span className="text-xl font-black leading-none">{item.step}</span>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-white px-8 py-3 rounded-full shadow-md border border-gray-50 min-w-[160px] md:min-w-[200px] text-center">
                      <span className="text-sm md:text-base font-black text-gray-800">{item.title}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex-grow">
                    <ul className="space-y-2">
                      {item.description.map((desc, i) => (
                        <li key={i} className="text-sm font-bold text-gray-600 flex items-start">
                          <span className="mr-1">・</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation & CTA Section - EXACT Design Match */}
      <section className="py-24 md:py-32 bg-[#e5e7eb] w-full">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-20">
            {/* Left: Navigation Links */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full md:w-auto">
              {[
                { label: 'メッセージ', href: '#message' },
                { label: '会社を知る', href: '#corporate' },
                { label: '事業内容', href: '#business' },
                { label: '仕事を知る', href: '#work' },
                { label: '募集職種', href: '#recruitment-type' },
                { label: 'カルチャーを知る', href: '#culture' },
                { label: 'メンバーを知る', href: '#people' },
                { label: '選考プロセス', href: '#selection-process' },
              ].map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="flex items-center gap-3 group"
                >
                  <span className="w-[1.5px] h-4 bg-gray-300 group-hover:bg-blue-500 transition-colors" />
                  <span className="text-sm md:text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors tracking-widest">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col gap-6 w-full max-w-md">
              {/* FAQ Button */}
              <Link 
                to="/faq" 
                className="flex items-center justify-between bg-[#333333] hover:bg-[#222222] text-white px-10 py-5 rounded-full shadow-lg transition-all group"
              >
                <span className="text-base md:text-lg font-bold tracking-widest">採用に関するFAQ</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>

              {/* Entry Button */}
              <a 
                href="https://jp.indeed.com/cmp/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BEmeta-Heroes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white p-1 rounded-full shadow-lg hover:shadow-xl transition-all group overflow-hidden"
              >
                <span className="text-base md:text-lg font-bold tracking-[0.2em] pl-12 pr-4 py-4 flex-grow text-center">エントリー</span>
                <div className="bg-[#333333] w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
