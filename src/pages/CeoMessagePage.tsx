import React from 'react';
import { PageHero } from '../components/PageHero';

export const CeoMessagePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-32">
      <PageHero 
        titleEn="MESSAGE FROM THE CEO" 
        titleJa="代表メッセージ"
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* CEO Image */}
        <div className="mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden rounded-sm">
          <img 
            src="/assets/ceo-message/代表メッセージ_ファーストビュー.png" 
            alt="代表取締役社長CEO 松石 和俊" 
            className="w-full h-auto"
          />
        </div>

        {/* Catchphrase & Profile */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-12 leading-tight tracking-tight">
            境界線を超えて、誰もがHEROになれる世界へ
          </h2>
          
          <div className="border-t border-gray-100 pt-12">
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-2xl font-black text-gray-800">松石 和俊</h3>
              <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Kazutoshi Matsuishi</p>
            </div>
            
            <p className="text-base font-bold text-gray-800 mb-10 tracking-wider">代表取締役社長CEO</p>

            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/kazutoshi.matsuishi/?locale=ja_JP" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a 
                href="https://x.com/kazu_hero100" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-24">
          <section>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-black text-gray-800">引きこもり支援とデジタルの可能性</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest">
                <p>社会には、部屋から出られないことで「孤立」していると感じている人たちがいます。しかし、私には彼らが、誰よりも深い集中力と、想像力を秘めたクリエイターに感じます。</p>
                <p>Meta Heroesの原点は、彼らに「活躍できる場所（ステージ）」を用意すること。部屋にいながら、世界を感動させる。アバターを通じて、国境を越えた友と笑い合う。それはもはや「避難場所」ではなく、新しい時代の「最前線」です。</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-black text-gray-800">テクノロジーを社会に実装</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest">
                <p>私たちが作るメタバースは、単なる仮想空間ではありません。それは、人の成長を促し、地方の課題を解決し、災害から命を守るための「社会装置」です。</p>
                <p>作るのは、未来のHEROたち。最新の技術を武器に、私たちは社会課題に立ち向かっています。「和を以て貴しとなす」。リアルとデジタル、人と技術が調和し、誰も取り残さない社会。それを実装するのが私たちの仕事です。</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-black text-gray-800">100のHEROと共に創る未来</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest">
                <p>19歳の時、私は「2044年までに100のHEROを創る」と誓いました。私一人がヒーローになる必要はありません。100人の次世代のリーダーたちが、それぞれの色で輝く未来を創ります。</p>
                <p>さあ、次はあなたの番です。この無限の可能性を秘めた空間で、一緒に新しい物語を始めましょう。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};