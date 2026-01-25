import React from 'react';
import { PageHero } from '../components/PageHero';

export const MissionPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="OUR MISSION" 
        titleJa="Meta Heroesの使命"
      />

      <div className="container mx-auto px-4 max-w-4xl space-y-32">
        {/* VISION Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">VISION</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">ビジョン</h2>
              <div className="w-full h-px bg-gray-100 relative mt-4">
                <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
              100のHEROを創出するリーディングカンパニーになる。
            </h3>
            <p className="text-gray-600 leading-[1.8] font-medium tracking-wider">
              テクノロジーによって描かれた未来の社会「Society 5.0」と、世界が目指すべき目標「SDGs」を実現するためには、行動力のある個人、つまり「ヒーロー」が必要です。そのために、「学ぶ人」「挑戦する人」「変革する人」を次々と生み出す仕組みを作り、未来を実現する人材で満たされた世界を目指します。
            </p>
            
            {/* Vision Diagram */}
            <div className="py-12 flex justify-center">
              <img src="/assets/mission/vision.png" alt="Vision Diagram" className="w-full max-w-2xl h-auto" />
            </div>
          </div>
        </section>

        {/* MISSION Section */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">MISSION</span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">ミッション</h2>
              <div className="w-full h-px bg-gray-100 relative mt-4">
                <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
              HEROを生み出し、デジタルとリアルの両面から社会課題解決に挑む。
            </h3>
            <p className="text-gray-600 leading-[1.8] font-medium tracking-wider">
              私たちは、原体験・環境・目標のエコシステムを社会実装することで、未来を担う次世代のHEROを生み出し続けます。現実世界とデジタルの両方を活用し、テクノロジーの力で「社会課題」を「遊び」で「社会貢献」に変えます。
            </p>
          </div>
        </section>

                                {/* VALUE Section */}

                                <section>

                                  <div className="mb-12">

                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">VALUE</span>

                                    <div className="flex flex-col items-start">

                                      <h2 className="text-2xl md:text-3xl font-black text-gray-800">バリュー</h2>

                                      <div className="w-full h-px bg-gray-100 relative mt-4">

                                        <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />

                                      </div>

                                    </div>

                                  </div>

                  <div className="space-y-12">

                    <div className="space-y-6">

                      <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">

                        HEROをつくるHEROに

                      </h3>

                      <p className="text-gray-600 leading-[1.8] font-medium tracking-wider">

                        一人ひとりが経営者の視点を持ち、HEROを生み出すための行動をします。そして、チーム一丸となって、社会課題を解決するHEROを作り、支え、および自分たち自身もHEROになります。

                      </p>

                    </div>

        

                    {/* Value Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                      {[
                        { label: '光', en: 'HOPE', icon: '/assets/mission/value_light.png', text: '社会にとって価値のある未来のビジョンを描き、仲間に共有する。' },
                        { label: '火', en: 'WELL', icon: '/assets/mission/value_fire.png', text: '自分自身の力で新しい仕組みを生み出す勇気と情熱を持つ。' },
                        { label: '水', en: 'SOLVE', icon: '/assets/mission/value_water.png', text: '役割や立場を超えて、課題に柔軟に対応する。' },
                      ].map((value, idx) => (
                        <div 
                          key={value.label} 
                          className={`border border-gray-100 rounded-2xl p-4 md:p-10 flex flex-col items-center text-center space-y-4 md:space-y-6 ${
                            idx === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'
                          }`}
                        >
                          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 tracking-widest">{value.en}</span>
                          <div className="space-y-2 md:space-y-4">
                            <h4 className="text-xl md:text-3xl font-black text-gray-800">{value.label}</h4>
                            <div className="w-10 h-10 md:w-16 md:h-16 mx-auto">
                              <img src={value.icon} alt={value.label} className="w-full h-full object-contain" />
                            </div>
                          </div>
                          <p className="text-[11px] md:text-sm font-medium text-gray-600 leading-relaxed">
                            {value.text}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>

                </section>
      </div>
    </main>
  );
};