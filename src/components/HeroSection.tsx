import { MemberData } from '../types/member';
import { StatCard } from './StatCard';

interface HeroSectionProps {
  member: MemberData;
}

export const HeroSection = ({ member }: HeroSectionProps) => {
  const { name, role, catchphrase, heroImage, stats } = member;

  return (
    <section className="relative min-h-screen overflow-hidden z-10">
      {/* 背景画像（全面）+ 下の角丸 */}
      <div
        className="absolute inset-0 bg-cover bg-[position:80%_center] lg:bg-center bg-no-repeat rounded-b-[50px]"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      
      {/* モバイル用オーバーレイ: テキストの可読性確保と人物の表示を両立 */}
      <div className="absolute inset-0 lg:hidden bg-gradient-to-r from-white/60 via-white/20 to-transparent pointer-events-none" />

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-center min-h-screen pt-24">
        {/* キャッチコピー (モバイル: 左寄せ・サイズアップ) */}
        <div className="w-full lg:w-[70%] mb-8 md:mb-8 text-left">
          <h1
            className="font-bold text-gray-900 leading-[1.1] whitespace-pre-line"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)' }}
          >
            {catchphrase.main}
          </h1>
          <p
            className="font-bold text-primary-blue italic mt-1"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 5.5rem)' }}
          >
            {catchphrase.emphasis}
          </p>
        </div>

        {/* モバイル用: 名前と役職 (右寄せ・サイズアップ) */}
        <div className="lg:hidden flex flex-col items-end mb-10 origin-right pr-2">
          {/* 役職：シアングラデーションの斜め帯 */}
          <div className="relative mb-2">
            <div
              className="py-2.5 px-12"
              style={{
                background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
                clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                minWidth: '260px',
              }}
            >
              <p className="text-white text-base font-bold italic tracking-wide text-center">
                {role}
              </p>
            </div>
          </div>
          {/* 名前：青グラデーションの斜め帯 */}
          <div
            className="relative"
            style={{ marginRight: '10px' }}
          >
            <div
              className="py-2.5 px-12"
              style={{
                background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
                clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                minWidth: '200px',
              }}
            >
              <h2 className="text-white text-2xl font-bold tracking-wider text-center">
                {name}
              </h2>
            </div>
          </div>
        </div>

        {/* 実績カード（画面中央・コンパクト化） */}
        <div className="w-full flex flex-wrap md:flex-nowrap gap-2 md:gap-8 justify-center">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* 右側: 名前と役職（斜め帯デザイン） */}
        <div className="hidden lg:block absolute top-[38%] right-[12%]">
          {/* 役職：シアングラデーションの斜め帯 */}
          <div className="relative mb-2">
            <div
              className="py-3 px-16"
              style={{
                background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
                clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                minWidth: '320px',
              }}
            >
              <p className="text-white text-lg font-bold italic tracking-wide text-center">
                {role}
              </p>
            </div>
          </div>
          {/* 名前：青グラデーションの斜め帯 */}
          <div
            className="relative"
            style={{ marginLeft: '50px' }}
          >
            <div
              className="py-3 px-16"
              style={{
                background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
                clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                minWidth: '240px',
              }}
            >
              <h2 className="text-white text-2xl font-bold tracking-wider text-center">
                {name}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
