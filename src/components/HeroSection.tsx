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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-[50px]"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 flex flex-col justify-center min-h-screen">
        {/* キャッチコピー */}
        <div className="w-full lg:w-[70%] mb-8">
          <h1
            className="font-bold text-gray-900 leading-[1.2] whitespace-pre-line"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            {catchphrase.main}
          </h1>
          <p
            className="font-bold text-primary-blue italic"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
          >
            {catchphrase.emphasis}
          </p>
        </div>

        {/* 実績カード（画面中央） */}
        <div className="w-full flex flex-nowrap gap-8 justify-center">
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
