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
            src="/assets/ceo-message/ceo_message_hero.png" 
            alt="代表取締役社長CEO 松石 和俊" 
            className="w-full h-auto"
          />
        </div>

        {/* Catchphrase & Profile */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-12 leading-tight tracking-tight">
            100人のヒーローを生み出す、<br />「ナンバーゼロ」としての挑戦。
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
                <h4 className="text-2xl font-black text-gray-800">19歳の誓い。100人のヒーローを生むための「2,500の挑戦」</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest text-justify">
                <p>私の原点は、熊本で母がトリプルワークをこなす姿を見て育った幼少期にあります。19歳の時にノートに記したビジョンは「世界で活躍するヒーローを100人育てる」こと。その実現には、圧倒的な挑戦の数が必要です。</p>
                <p>たとえ成功率が数％でも、2,500の事業を立ち上げることで、社会を動かす一握りの才能が生まれる土壌を創り続けます。「やってみたい」を形にする仕組みこそが、停滞する日本を突破する鍵になると確信しています。</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-black text-gray-800">「ナンバーワンを創るナンバーゼロ」としての覚悟</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest text-justify">
                <p>私は自分が一番になることより、誰かを輝かせる「ナンバーゼロ」の存在でありたいと考えています。わずか50万円の自己資金からスタートしたのは、特別な才能がなくても工夫次第で誰でも挑戦できると証明したかったからです。</p>
                <p>失敗しても「30秒だけ落ち込む」と決めて前を向く。何でもできる「出木杉くん」ではなく、失敗しながらも立ち上がる「のび太くん」が主役になれる、そんな誠実なチームで大きな夢を現実にしていきます。</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start">
                <h4 className="text-2xl font-black text-gray-800">Meta Heroesが拓く、誰もが輝ける社会の実装へ</h4>
                <div className="w-full h-px bg-gray-100 relative mt-4">
                  <div className="absolute top-0 left-0 w-12 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="text-gray-700 leading-[1.8] space-y-8 text-[15px] font-medium tracking-widest text-justify">
                <p>Meta Heroesのミッションは、最新技術を誇示することではなく「人の価値を証明すること」にあります。テクノロジーは人間の代替ではなく、地方や未経験といった壁を越え、個人の可能性を拡張する最高のパートナーです。</p>
                <p>私たちは、AIやメタバースを誰もが使える武器に変え、「普通の人がすごくなれる社会」を実装します。次世代の挑戦を称える文化を創り、一人ひとりがヒーローとして羽ばたける未来を切り拓いていきます。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};