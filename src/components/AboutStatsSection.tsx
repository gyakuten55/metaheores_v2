import React from 'react';

export const AboutStatsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Title Area */}
        <div className="mb-12">
          <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">
            META HEROES BY THE NUMBERS
          </span>
          <div className="flex flex-col items-start">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">
              数字で見るMeta Heroes
            </h2>
            <div className="w-full h-px bg-gray-100 relative mt-4">
              <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Date Stamp */}
        <div className="text-right mb-6">
          <span className="text-[10px] md:text-xs text-gray-400 font-bold">2026年1月時点 実績</span>
        </div>

        {/* Top Large Card: User Stats */}
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.04)] mb-8">
          <h3 className="text-center text-lg font-black text-gray-800 mb-12 relative pb-4">
            ユーザー数
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gray-100" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {[
              { label: 'メタバース\nプレイ数', value: '27', suffix: '万名', icon: '/assets/about/メタバースプレイ数_icon.png' },
              { label: 'イベント\n来場者数', value: '13', suffix: '万名', icon: '/assets/about/イベント来場者数_icon.png' },
              { label: 'AI/DX人材育成研修\n受講者数', value: '1.5', suffix: '万名', icon: '/assets/about/AIDX人材育成研修受講者数_icon.png' },
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center ${idx !== 2 ? 'md:border-r border-gray-100' : ''}`}>
                <div className="w-16 h-16 mb-6">
                  <img src={item.icon} alt="" className="w-full h-full object-contain opacity-60" />
                </div>
                <p className="text-sm font-bold text-gray-800 whitespace-pre-line mb-4 leading-tight">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-gray-800 tracking-tighter">{item.value}</span>
                  <span className="text-lg font-bold text-gray-800">{item.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Three Independent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: '設立年', value: '2021', suffix: '年', icon: '/assets/about/設立年_icon.png' },
            { label: '従業員数', value: '17', suffix: '名', icon: '/assets/about/従業員数_icon.png' },
            { label: '平均年齢', value: '29.1', suffix: '歳', icon: '/assets/about/平均年齢_icon.png' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
              <h3 className="text-sm font-black text-gray-800 mb-8 relative pb-4 w-full">
                {item.label}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gray-100" />
              </h3>
              <div className="w-16 h-16 mb-8">
                <img src={item.icon} alt="" className="w-full h-full object-contain opacity-60" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-800 tracking-tighter">{item.value}</span>
                <span className="text-lg font-bold text-gray-800">{item.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};