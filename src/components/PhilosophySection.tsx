import { Philosophy } from '../types/member';

interface PhilosophySectionProps {
  philosophy: Philosophy;
}

export const PhilosophySection = ({ philosophy }: PhilosophySectionProps) => {
  const { backgroundImage, paragraphs } = philosophy;

  return (
    <section className="relative overflow-hidden -mt-12">
      {/* 背景画像 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 md:px-8 pt-24 pb-32 md:pt-32 md:pb-40">
        {/* タイトル */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-12 md:mb-16 tracking-widest">
          Philosophy
        </h2>

        {/* テキスト段落 */}
        <div className="max-w-2xl space-y-8 md:space-y-10 text-center">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-white text-xs md:text-sm lg:text-base font-bold leading-relaxed md:leading-loose whitespace-pre-line tracking-wide"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
