import { Skill, CaseStudy } from '../types/member';

interface SkillsSectionProps {
  skills: Skill[];
  caseStudy: CaseStudy;
}

export const SkillsSection = ({ skills, caseStudy }: SkillsSectionProps) => {
  return (
    <section className="relative bg-white rounded-t-[50px] -mt-12 z-20">
      <div className="container mx-auto px-8 lg:px-24 py-24 max-w-4xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">スキルセット</span>
        </div>

        {/* タイトル */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-20">
          私の強み・専門領域
        </h2>

        {/* スキルリスト */}
        <div className="space-y-24">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-start gap-6 justify-center">
              {/* 番号 */}
              <span
                className="text-gray-200 leading-none italic font-light"
                style={{ fontSize: '8rem' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* コンテンツ */}
              <div className="pt-6">
                <h3 className="text-xl lg:text-2xl font-bold text-blue-500 mb-4">
                  {skill.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xl">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ケーススタディ */}
        <div className="mt-32">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 italic">
            ケーススタディ
          </h2>

          {/* ケーススタディカード */}
          <div className="bg-gray-50 rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* 左側: 画像 */}
              <div className="lg:w-1/2">
                <img
                  src={caseStudy.image}
                  alt="ケーススタディ"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>

              {/* 右側: テキスト */}
              <div className="lg:w-1/2 space-y-8 py-4">
                <div>
                  <h4 className="text-rose-400 text-sm font-semibold mb-2">課題</h4>
                  <p className="text-gray-900 text-base leading-relaxed">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-cyan-500 text-sm font-semibold mb-2">アプローチ</h4>
                  <p className="text-gray-900 text-base leading-relaxed">{caseStudy.approach}</p>
                </div>
                <div>
                  <h4 className="text-cyan-500 text-sm font-semibold mb-2">結果</h4>
                  <p className="text-gray-900 text-base leading-relaxed">{caseStudy.result}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
