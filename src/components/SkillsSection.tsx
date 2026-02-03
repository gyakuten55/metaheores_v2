import { Skill, CaseStudy } from '../types/member';

interface SkillsSectionProps {
  skills: Skill[];
  caseStudy: CaseStudy;
}

export const SkillsSection = ({ skills, caseStudy }: SkillsSectionProps) => {
  return (
    <section className="relative bg-white rounded-t-[50px] -mt-12 z-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-24 py-16 md:py-24 max-w-4xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">スキルセット</span>
        </div>

        {/* タイトル */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 md:mb-20">
          私の強み・専門領域
        </h2>

        {/* スキルリスト */}
        <div className="space-y-16 md:space-y-24">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 md:justify-center text-center md:text-left">
              {/* 番号 */}
              <span
                className="text-gray-100 leading-none italic font-light scale-75 md:scale-100"
                style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* コンテンツ */}
              <div className="md:pt-6">
                <h3 className="text-xl lg:text-2xl font-bold text-blue-500 mb-3 md:mb-4">
                  {skill.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xl text-sm md:text-base">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ケーススタディ */}
        <div className="mt-20 md:mt-32">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 md:mb-12 italic">
            ケーススタディ
          </h2>

          {/* ケーススタディカード */}
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
              {/* 左側: 画像 */}
              <div className="lg:w-1/2 overflow-hidden rounded-xl md:rounded-2xl bg-gray-200">
                <img
                  src={caseStudy.image || '/assets/top/business_bg.png'}
                  alt="ケーススタディ"
                  className="w-full h-48 md:h-full md:min-h-[300px] object-cover"
                />
              </div>

              {/* 右側: テキスト */}
              <div className="lg:w-1/2 space-y-6 md:space-y-8 py-2 md:py-4">
                <div>
                  <h4 className="text-rose-400 text-xs md:text-sm font-semibold mb-1 md:mb-2">課題</h4>
                  <p className="text-gray-900 text-sm md:text-base leading-relaxed">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-cyan-500 text-xs md:text-sm font-semibold mb-1 md:mb-2">アプローチ</h4>
                  <p className="text-gray-900 text-sm md:text-base leading-relaxed">{caseStudy.approach}</p>
                </div>
                <div>
                  <h4 className="text-cyan-500 text-xs md:text-sm font-semibold mb-1 md:mb-2">結果</h4>
                  <p className="text-gray-900 text-sm md:text-base leading-relaxed">{caseStudy.result}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
