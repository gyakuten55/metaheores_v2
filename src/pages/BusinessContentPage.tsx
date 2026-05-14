import React, { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlogs, Blog } from '../lib/microcms';
import { Link } from 'react-router-dom';

type BusinessType = 'xr' | 'ai' | 'event' | 'facility';

const CATEGORY_MAP: Record<BusinessType, string> = {
  xr: 'メタバース開発実績',
  ai: 'AI / 開発 実績',
  event: 'イベント実績',
  facility: 'Hero Egg 実績',
};

const BUSINESS_TABS = [
  { id: 'xr' as BusinessType, label: 'XR事業', image: '/assets/business-content/metaverce/metaverse_hero.png' },
  { id: 'ai' as BusinessType, label: 'AI事業', image: '/assets/business-content/ai/ai_hero.png' },
  { id: 'event' as BusinessType, label: 'イベント事業', image: '/assets/business-content/event/event_hero.png' },
  { id: 'facility' as BusinessType, label: '施設活用事業', image: '/assets/business-content/vacant-facility/vacant_hero.png' },
];

const CONTENT_DATA = {
  xr: {
    titleJa: 'XR事業',
    titleEn: 'EXTENDED REALITY',
    heroImage: '/assets/business-content/metaverce/metaverse_hero.png',
    concept: '社会課題をエンタメに翻訳する',
    description: '社会課題を、メタバースだからこそ解決できるサービスとして展開。重い問題を「エンターテインメント」へと翻訳し、参加のハードルを下げます。',
    issues: [
      { label: '社会課題への無関心', icon: '/assets/business-content/metaverce/indifference.png', points: ['情報不足', '他人事', 'きっかけがない'] },
      { label: '難解な解決プロセス', icon: '/assets/business-content/metaverce/difficult_process.png', points: ['問題の複雑さ', '解決の方法が周知されていない'] },
      { label: '若年層の巻き込み', icon: '/assets/business-content/metaverce/youth_involvement.png', points: ['参加方法が分からない', '地域・社会とのつながりの希薄化'] },
    ],
    solutions: [
      { title: 'ゲーム性のある学習', text: 'ユーザーが積極的に参加するために、ゲームの要素を取り入れた体験を中心としたデザインを提供します。', image: '/assets/business-content/metaverce/game_learning.png' },
      { title: '没入体験', text: '物理的な制約を超えて、安全に実践的なシミュレーションを何度でも体験できます。', image: '/assets/business-content/metaverce/immersion.png' },
      { title: 'ワンストップ体制', text: '企画から運用まで、一気通貫で対応するため、開発コストの削減や一貫したブランド体験を提供します。', image: '/assets/business-content/metaverce/onestop.png' },
    ]
  },
  ai: {
    titleJa: 'AI事業',
    titleEn: 'ARTIFICIAL INTELLIGENCE',
    heroImage: '/assets/business-content/ai/ai_hero.png',
    concept: 'AI技術でビジネスと教育を加速させる',
    description: '最新のAI技術を実社会に実装。ビジネスプロセスの効率化から、次世代のAI人材育成まで、未来を見据えたソリューションを提供します。',
    issues: [
      { label: 'AI人材不足', icon: '/assets/business-content/ai/ai_shortage_icon.png', points: ['専門知識の欠如', '教育体制の未整備'] },
      { label: '時間とコスト', icon: '/assets/business-content/ai/time_cost_icon.png', points: ['導入プロセスの長期化', '高い初期投資'] },
      { label: '企業のDX推進力', icon: '/assets/business-content/ai/dx_power_icon.png', points: ['既存システムとの乖離', '変革への抵抗感'] },
    ],
    solutions: [
      { title: 'AI人材育成', text: '実務に直結するカリキュラムを通じて、即戦力となるAI人材を短期間で育成します。', image: '/assets/business-content/ai/ai_training.png' },
      { title: 'AI技術導入', text: '業務フローを分析し、最適なAIツールやカスタムモデルの導入をサポートします。', image: '/assets/business-content/ai/ai_implementation.png' },
      { title: '継続的なコミュニティ', text: '導入後も最新技術のキャッチアップができるよう、専門家によるサポートコミュニティを提供します。', image: '/assets/business-content/ai/continuous_community.png' },
    ]
  },
  event: {
    titleJa: 'イベント事業',
    titleEn: 'EVENT & EXPERIENCE',
    heroImage: '/assets/business-content/event/event_hero.png',
    concept: 'リアルな体験が未来を変える',
    description: 'デジタル技術とリアルな場を融合させた、体験型イベントをプロデュース。五感を刺激する演出で、確かな感動と深い理解を生み出します。',
    issues: [
      { label: '一過性の施策', icon: '/assets/business-content/event/temporary_measure_icon.png', points: ['リピーターの欠如', '効果測定の難しさ'] },
      { label: '地方の過疎化', icon: '/assets/business-content/event/depopulation_icon.png', points: ['若年層の流出', '集客力の低下'] },
      { label: '教育格差', icon: '/assets/business-content/event/education_gap_icon.png', points: ['体験機会の不足', '情報の地域差'] },
    ],
    solutions: [
      { title: 'DX技術の体験会', text: '最新のメタバースやAIを実際に体験できる場を提供し、テクノロジーを身近に感じさせます。', image: '/assets/business-content/event/dx_experience.png' },
      { title: 'オープンイノベーション', text: '異なる業界や世代が交わる場を創出し、新しいアイデアやコラボレーションを誘発します。', image: '/assets/business-content/event/open_innovation.png' },
      { title: 'イベント出展', text: '国内外の主要な展示会やフェスティバルへの出展を通じて、ブランドの認知度を最大化します。', image: '/assets/business-content/event/event_exhibition.png' },
    ]
  },
  facility: {
    titleJa: '施設活用事業',
    titleEn: 'FACILITY UTILIZATION',
    heroImage: '/assets/business-content/vacant-facility/vacant_hero.png',
    concept: '眠れる資産を地域の希望へ',
    description: '全国に広がる遊休施設を、最先端のDX教育拠点やコミュニティスペースとして再生。地域に新しい人の流れと雇用を創出します。',
    issues: [
      { label: '遊休資産の活用', icon: '/assets/business-content/vacant-facility/idle_assets_icon.png', points: ['維持コストの負担', '地域の治安悪化'] },
      { label: 'DX教育環境の不足', icon: '/assets/business-content/vacant-facility/dx_env_shortage_icon.png', points: ['学習拠点の不在', '指導者の不足'] },
      { label: '漠然とした学び', icon: '/assets/business-content/vacant-facility/vague_learning_icon.png', points: ['目的の不明確さ', '実社会との接点のなさ'] },
    ],
    solutions: [
      { title: '産官学と連携したDX教育', text: '自治体や大学と連携し、地域に根ざした持続可能な教育プログラムを構築します。', image: '/assets/business-content/vacant-facility/dx_education_collab.png' },
      { title: '遊休施策の収益化', baseText: '使われていない施設を収益を生む拠点へと転換。経済的な自立をサポートします。', image: '/assets/business-content/vacant-facility/monetization.png' },
      { title: 'CSR型エコシステム', text: '企業、地域、個人が三方良しとなる持続可能なコミュニティモデルを形成します。', image: '/assets/business-content/vacant-facility/csr_ecosystem.png' },
    ]
  }
};

interface RelatedService {
  title: string;
  category: string;
  description: string;
  image: string;
  path: string;
}

const RELATED_SERVICES: Record<BusinessType, RelatedService[]> = {
  xr: [
    { title: 'AI MONDAY', category: 'ハイブリッドコミュニティ', description: 'AI・XRの最新トレンドを共有し、学び合う専門コミュニティです。', image: '/assets/services/first-view/ai_monday_thumb.png', path: '/services/ai-monday' },
    { title: 'THE HERO SUMMIT', category: 'イベント', description: '企業やクリエイターが集まり、新たな価値を創造するカンファレンスです。', image: '/assets/services/first-view/ghs_first_thumb.png', path: '/services/global-hero-summit' },
    { title: 'Hero Egg', category: 'DX教室施設運用', description: '子どもから大人まで学べるDX教育施設。XR体験も提供します。', image: '/assets/services/first-view/hero_egg_thumb.png', path: '/services/hero-egg' },
  ],
  ai: [
    { title: 'AI 人材育成研修', category: 'AI企業研修', description: '企業・団体向けのAIリテラシー向上および実践的な活用研修サービスです。', image: '/assets/services/first-view/ai_training_thumb.png', path: '/services/ai-training' },
    { title: 'AI MONDAY', category: 'ハイブリッドコミュニティ', description: 'AIの最新トレンドを共有し、学び合う専門コミュニティです。', image: '/assets/services/first-view/ai_monday_thumb.png', path: '/services/ai-monday' },
  ],
  event: [
    { title: 'THE HERO SUMMIT', category: 'イベント', description: '企業やクリエイターが集まり、新たな価値を創造するカンファレンスです。', image: '/assets/services/first-view/ghs_first_thumb.png', path: '/services/global-hero-summit' },
    { title: 'EGG JAM', category: 'オンラインコミュニティ', description: '挑戦する人を応援し、交流を深めるオンラインコミュニティです。', image: '/assets/services/first-view/egg_jam_thumb.png', path: '/services/egg-jam' },
    { title: 'AI MONDAY', category: 'ハイブリッドコミュニティ', description: 'AIの最新トレンドを共有し、学び合う専門コミュニティです。', image: '/assets/services/first-view/ai_monday_thumb.png', path: '/services/ai-monday' },
  ],
  facility: [
    { title: 'Hero Egg', category: 'DX教室施設運用', description: '子どもから大人まで学べるDX教育施設。子どもたちは無料でテクノロジーを学べます。', image: '/assets/services/first-view/hero_egg_thumb.png', path: '/services/hero-egg' },
    { title: 'Meta Heroes Guild', category: 'コミュニティスペース', description: '特定のテーマで、飲食ができるコミュニティスペースです。', image: '/assets/services/first-view/mhg_first_thumb.png', path: '/services/meta-heroes-guild' },
  ],
};

export const BusinessContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BusinessType>('xr');
  const [caseStudies, setCaseStudies] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const currentContent = CONTENT_DATA[activeTab];

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);
      try {
        const response = await getBlogs(10, undefined, {
          categoryId: CATEGORY_MAP[activeTab],
        });
        setCaseStudies(response.contents);
      } catch (error) {
        console.error('Failed to fetch case studies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero titleEn="BUSINESS OVERVIEW" titleJa="事業内容" />

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 max-w-5xl mb-16 md:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {BUSINESS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative h-14 md:h-20 overflow-hidden rounded-lg md:rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/20 translate-y-[-2px]' 
                    : 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0 hover:translate-y-[-1px]'
                }`}
              >
                <img src={tab.image} alt={tab.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-blue-600/30' : 'bg-black/50 group-hover:bg-black/30'}`} />
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <span className={`font-black text-[10px] md:text-xs tracking-widest text-center leading-tight transition-all duration-300 ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Content Title */}
          <div className="text-center mb-16 px-4">
            <span className="text-[10px] md:text-xs font-bold text-blue-600 tracking-[0.2em] uppercase block mb-3">
              {currentContent.titleEn}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-12">{currentContent.titleJa}</h2>
          </div>

          {/* Full Width Hero Banner (Obi Style) */}
          <div className="w-full h-[300px] md:h-[500px] overflow-hidden mb-24">
            <img src={currentContent.heroImage} alt="" className="w-full h-full object-cover" />
          </div>
          
          <div className="container mx-auto px-4 max-w-4xl mb-32 text-center">
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
                {currentContent.concept}
              </h3>
              <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider max-w-3xl mx-auto">
                {currentContent.description}
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-4xl space-y-32">
            {/* Issues Section */}
            <section>
              <div className="mb-12">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">ISSUE</span>
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800">解決したい課題</h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {currentContent.issues.map((issue, i) => (
                  <div 
                    key={i} 
                    className={`bg-white border border-gray-100 rounded-2xl p-4 md:p-8 shadow-sm flex flex-col items-center text-center space-y-4 md:space-y-6 ${
                      i === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'
                    }`}
                  >
                    <div className="w-10 h-10 md:w-16 md:h-16">
                      <img src={issue.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-[13px] md:text-base font-black text-gray-800 leading-tight">{issue.label}</h4>
                    <ul className="text-[10px] md:text-xs font-bold text-gray-400 space-y-1 md:space-y-2">
                      {issue.points.map((p, j) => <li key={j}>・{p}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Solutions Section */}
            <section>
              <div className="mb-12">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">SOLUTION</span>
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800">提供する解決策</h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
                </div>
              </div>
              <div className="space-y-12">
                {currentContent.solutions.map((sol, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center gap-10 bg-gray-50/50 rounded-2xl p-8">
                    <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-md">
                      <img src={sol.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4 text-left">
                      <h4 className="text-xl font-black text-gray-800">{sol.title}</h4>
                      <p className="text-sm md:text-base font-medium text-gray-600 leading-relaxed tracking-wider">
                        {sol.text || (sol as any).baseText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CASE STUDY & WORKS Section */}
            <section>
              <div className="mb-12">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">CASE STUDY & WORKS</span>
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800">導入事例・実績</h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
                </div>
              ) : caseStudies.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl py-20 text-center">
                  <p className="text-gray-400 font-bold tracking-widest">実績がまだありません</p>
                </div>
              ) : (
                <div className="flex overflow-x-auto pb-8 md:grid md:grid-cols-4 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  {caseStudies.map((item) => (
                    <Link key={item.id} to={`/news/${item.id}`} className="group block flex-shrink-0 w-[200px] md:w-auto">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:rounded-xl mb-3 bg-gray-100 shadow-sm border border-gray-50">
                        <img 
                          src={item.eyecatch?.url || 'https://via.placeholder.com/800x600?text=No+Image'} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2 px-0.5">
                        <time className="text-[8px] md:text-[10px] font-black text-gray-300 tracking-[0.1em] md:tracking-[0.2em] block">
                          {formatDate(item.publishedAt)}
                        </time>
                        <h3 className="text-gray-800 text-[11px] md:text-sm font-black leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="text-center mt-16">
                <Link
                  to="/works"
                  className="inline-flex items-center gap-3 px-10 py-3 bg-gray-800 text-white text-xs font-black rounded-full hover:bg-black transition-all group shadow-lg"
                >
                  もっと見る
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </section>

            {/* Related Services Section */}
            {RELATED_SERVICES[activeTab].length > 0 && (
              <section>
                <div className="mb-12">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">RELATED SERVICES</span>
                  <div className="flex flex-col items-start">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800">関連サービス</h2>
                    <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {RELATED_SERVICES[activeTab].map((service) => (
                    <Link key={service.path} to={service.path} className="group flex flex-col h-full">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-white border border-gray-100 mb-5">
                        <img
                          src={service.image}
                          alt=""
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-blue-500 group-hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <span className="block text-[10px] text-gray-400 font-bold mb-1 tracking-wider">{service.category}</span>
                          <h4 className="text-base font-black text-gray-800 mb-2 tracking-wider group-hover:text-blue-600 transition-colors">{service.title}</h4>
                          <p className="text-xs text-gray-600 leading-[1.8] font-medium tracking-wide">{service.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-16">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-3 px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black rounded-full hover:shadow-lg hover:scale-105 transition-all group"
                  >
                    すべてのソリューションを見る
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Common Footer Sections */}
      <div className="container mx-auto px-4 max-w-4xl space-y-32 mt-32">
        {/* Synergy Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">THE SYNERGY</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">4事業のシナジー</h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
            </div>
          </div>
          <div className="space-y-12">
            <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
              各事業はそれぞれ独立して存在しているわけではありません。相互に連携することで、サービスの質を高めたり、新たな価値を生み出したりしています。
            </p>
            <div className="py-8 flex justify-center">
              <img src="/assets/business-content/synergy.png" alt="Synergy Diagram" className="w-full max-w-3xl h-auto" />
            </div>
          </div>
        </section>

        {/* Focus Areas Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">FOCUS AREAS</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">3つの注力分野</h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 mt-6" />
            </div>
          </div>
          <div className="space-y-12">
            <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
              私たちMeta Heroesは、ウェルビーイング社会を目指して、教育・防災・地方創生をテーマにした社会課題を、テクノロジー開発とリアルの場でのイベントや施設運営を通じて解決へと導きます。
            </p>
            <div className="py-8 flex justify-center">
              <img src="/assets/business-content/focus_areas.png" alt="Focus Areas" className="w-full max-w-3xl h-auto" />
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="mt-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 px-6 py-16 md:px-16 md:py-20 shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative z-10 text-center mb-10 md:mb-12">
              <span className="text-[10px] md:text-xs font-black text-white/80 tracking-[0.4em] uppercase block mb-4">CONTACT</span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                事業に関するお問い合わせ
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium tracking-wider">
                Meta Heroesの事業について、もっと詳しく知りたい方はお気軽にお問い合わせください。
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <Link
                to="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-between gap-4 px-8 py-4 bg-white text-blue-600 text-sm font-black rounded-full hover:shadow-2xl hover:scale-105 transition-all min-w-[260px]"
              >
                <span className="flex flex-col items-start">
                  <span className="tracking-wide">お問い合わせ</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">Contact</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                to="/document-request"
                className="group w-full sm:w-auto inline-flex items-center justify-between gap-4 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white text-sm font-black rounded-full hover:bg-white/20 hover:scale-105 transition-all min-w-[260px]"
              >
                <span className="flex flex-col items-start">
                  <span className="tracking-wide">お役立ち資料</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">Document</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};