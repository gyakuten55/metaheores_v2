import React from 'react';
import { PageHero } from '../components/PageHero';

const CREDO_ITEMS = [
  { id: '01', title: '法令順守', text: '約束は守る、ルール・法律に則した動きをすること。コンプライアンス遵守。' },
  { id: '06', title: '洗練された社会マナー', text: '時間厳守：対面は10分前集合、オンラインは5分前ログイン。身だしなみを整えること、ふさわしい服装。' },
  { id: '02', title: 'ヒーローマインド（利他）', text: '挨拶と感謝を忘れず、困っている人に手を差し伸べる。' },
  { id: '07', title: '心理的安全面と柔軟性', text: 'ミスは「報告→事実整理→学び」を共有。1on1で安全確認を行う。' },
  { id: '03', title: 'ポジティブ対話（建設的）', text: '課題は「問題+影響+提案」で投稿。個人攻撃禁止。' },
  { id: '08', title: 'SDGsへの意識と実践', text: '再利用・リサイクル優先。不要電源はこまめにOFF。' },
  { id: '04', title: '相互扶助と助け合い', text: '困ったことは答えを持っている人に相談すること。' },
  { id: '09', title: '好奇心と探究心', text: '外部学習を推奨します。' },
  { id: '05', title: '迅速な報連相と創造性', text: '重要事項は即報告。' },
  { id: '10', title: '遊び心', text: 'クリエイティブ、事業提案にも遊び心を。' },
];

export const CodeOfConductPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="CODE OF CONDUCT" 
        titleJa="行動規範"
      />

      <div className="container mx-auto px-4 max-w-4xl space-y-32">
        {/* 10 HERO'S CRED Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">10 HERO'S CRED</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">10のHEROクレド</h2>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            {CREDO_ITEMS.map((item) => (
              <div key={item.id} className="bg-gray-50/50 p-6 flex gap-6 items-start rounded-sm">
                <span className="text-blue-600 font-black italic text-xl leading-none pt-1">{item.id}</span>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-gray-800 tracking-tight">{item.title}</h3>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HR100 Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">HR100</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">HR100</h2>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
              HERO100を創るためのRegulation／Record／Resilienceの仕組み
            </h3>
            <div className="text-gray-600 leading-relaxed font-medium space-y-4">
              <p>HEROになる×HEROを創る×HEROを支えるコンセプトのもと、100人のHEROを育てるために、チーム全員でつくり、守り、進化させていく行動規範の集合体です。</p>
              <p>トラブル、学び、葛藤のたびに、一つずつ増えていく”経験から生まれる”ルールです。</p>
            </div>

            {/* Step Cards */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-12">
              {/* Problem */}
              <div className="w-full md:w-[30%] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col h-48">
                <div className="bg-[#4DB8D7] text-white text-center py-2 text-xs font-bold tracking-widest">原因</div>
                <div className="p-6 flex flex-col items-center justify-center flex-grow space-y-3">
                  <span className="text-[#2563EB] font-black text-xl tracking-wider uppercase">PROBLEM</span>
                  <p className="text-[13px] font-bold text-gray-500">不安・危険・懸念・不明</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-2">
                <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200 rotate-90 md:rotate-0">
                  <path d="M4 4L20 20L4 36" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Solution */}
              <div className="w-full md:w-[30%] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col h-48 border-t-2 border-t-blue-500">
                <div className="bg-[#2563EB] text-white text-center py-2 text-xs font-bold tracking-widest">解決</div>
                <div className="p-6 flex flex-col items-center justify-center flex-grow space-y-3">
                  <span className="text-[#2563EB] font-black text-xl tracking-wider uppercase">SOLUTION</span>
                  <p className="text-[13px] font-bold text-gray-500">原因を追求し、解決</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-2">
                <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200 rotate-90 md:rotate-0">
                  <path d="M4 4L20 20L4 36" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Regulation */}
              <div className="w-full md:w-[30%] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col h-48">
                <div className="bg-[#4DB8D7] text-white text-center py-2 text-xs font-bold tracking-widest">規則</div>
                <div className="p-6 flex flex-col items-center justify-center flex-grow space-y-3">
                  <span className="text-[#2563EB] font-black text-xl tracking-wider uppercase">REGULATION</span>
                  <p className="text-[13px] font-bold text-gray-500">仕組み化し、ルール化</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};