import React from 'react';
import { PageHero } from '../components/PageHero';

export const AboutCompanyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="ABOUT US" 
        titleJa="Meta Heroesについて"
      />

      <div className="container mx-auto px-4 max-w-4xl space-y-40">
        {/* Section 1: Digital x Real */}
        <section>
          <div className="mb-16">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-3">
              CREATING NEW SOCIAL VALUE THROUGH DIGITAL AND REAL-WORLD COLLABORATION
            </span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                デジタル×リアルで新しい社会価値を生み出す
              </h2>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                私たちMeta Heroesは、教育・防災・地方創生などの様々な分野で抱える社会課題を、テクノロジー開発とリアルの場でのイベントを通じた、社会課題を解決するソーシャルイノベーターです。
              </p>
              <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                私たちは、メタバースを作っているだけでも、AIを教えているだけでもありません。それらは全て手段に過ぎないのです。私たちの本質は、社会に存在する「課題」を、テクノロジーとエンターテインメントの力で「希望」に変え、来るべきSociety 5.0の社会において、デジタルとリアルの境界をなくし、誰もがヒーローになれる舞台を作る役割を果たします。
              </p>
            </div>
            <div className="py-12 flex justify-center">
              <img src="/assets/about-company/about Meta Heroes.png" alt="" className="w-full max-w-3xl h-auto" />
            </div>
          </div>
        </section>

        {/* Section 2: Mechanism */}
        <section>
          <div className="mb-16">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-3">
              A SYSTEM THAT TURNS INDIFFERENCE INTO INTEREST, FROM THE BEGINNING TO THE END
            </span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                きっかけからゴールまで無関心を関心へ変える仕組み
              </h2>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                社会課題と聞くと、どうしても「難しそう」「自分には関係ない」と思ってしまいがちです。だからこそ私たちは、メタバースやAIといった最先端の技術を入り口にして、まずは「面白そう！」という【原体験】を作ります。
              </p>
              <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                さらに、興味を持った人がアイデアをカタチにできる【環境】として、DX教育施設「Hero Egg」を開設。そこでは、アワードやコンテストといった目指すべき【目標】も開催しています。「きっかけ」を与え、育て、評価する。このサイクルがあるからこそ、世の中を変える「ヒーロー」がここから生まれるのです。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 items-center">
              <img src="/assets/about-company/原体験・環境・目標.png" alt="" className="w-full h-auto" />
              <img src="/assets/about-company/エコシステム.png" alt="" className="w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Section 3: Strengths */}
        <section>
          <div className="mb-24">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block mb-3">STRENGTHS</span>
            <div className="flex flex-col items-start">
              <h2 className="text-3xl md:text-4xl font-black text-gray-800">私たちの強み</h2>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-800 mt-12">
              発注者と受注者を超え、事業を「共創」するパートナー
            </h3>
          </div>

          <div className="space-y-48">
            {/* Strength 1 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-1/2 space-y-8">
                  <div className="relative">
                    <span className="absolute -top-32 -left-16 text-[12rem] font-black text-gray-100 leading-none -z-10 select-none">01</span>
                    <h4 className="text-2xl font-black text-gray-800 leading-tight relative z-10">枠を超えた事業展開</h4>
                  </div>
                  <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                    「解決策はひとつ」とは限りません。私たちは幅広い事業を展開しているからこそ、ひとつの悩みに対して、様々な視点からアプローチすることができます。それぞれの事業が連携し合う独自の仕組みで、潜在的な可能性を引き出し、期待を超える成果をお届けします。
                  </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <img src="/assets/about-company/強み01.png" alt="" className="w-full max-w-md h-auto" />
                </div>
              </div>
            </div>

            {/* Strength 2 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-1/2 space-y-8">
                  <div className="relative">
                    <span className="absolute -top-32 -left-16 text-[12rem] font-black text-gray-100 leading-none -z-10 select-none">02</span>
                    <h4 className="text-2xl font-black text-gray-800 leading-tight relative z-10">窓口ひとつで戦略から実行まで</h4>
                  </div>
                  <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                    複数の業者に依頼することで生じる、煩雑なコミュニケーションや認識のズレは、プロジェクトの質とスピードを低下させます。私たちは、企画・開発・運用までを自社内で完結できるワンストップ体制を構築。全工程において責任の所在を明確にし、ブレのない一貫した品質で、貴社のビジネスを最短距離でゴールへ導きます。
                  </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <img src="/assets/about-company/強み02.png" alt="" className="w-full max-w-md h-auto" />
                </div>
              </div>
            </div>

            {/* Strength 3 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-1/2 space-y-8">
                  <div className="relative">
                    <span className="absolute -top-32 -left-16 text-[12rem] font-black text-gray-100 leading-none -z-10 select-none">03</span>
                    <h4 className="text-2xl font-black text-gray-800 leading-tight relative z-10">多種多様な業界にわたる豊富な実績</h4>
                  </div>
                  <p className="text-gray-600 leading-[1.8] font-medium text-base tracking-wider">
                    私たちの強みは、単なる実績数ではありません。決まった業界だけでなく、民間企業や国、自治体など、あらゆる業界での取引実績があります。ニーズに合わせて、柔軟に状況に適応した進め方ができますので、どのような要望でもお気軽にご相談ください。
                  </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <img src="/assets/about-company/強み03.png" alt="" className="w-full max-w-md h-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};