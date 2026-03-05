import { QAItem } from '../types/member';

interface QASectionProps {
  qa: QAItem[];
}

export const QASection = ({ qa }: QASectionProps) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-8 lg:px-24 max-w-5xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">Q&A</span>
        </div>

        {/* タイトル */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-20">
          社員インタビュー
        </h2>

        {/* Q&Aリスト */}
        <div className="space-y-24">
          {qa.map((item, index) => {
            const isImageLeft = index % 2 === 0;
            const questionNumber = `Q.${index + 1}`;

            return (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-10 items-center ${
                  isImageLeft ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* 画像 */}
                <div className="lg:w-1/2">
                  <img
                    src={item.image}
                    alt={item.question}
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>

                {/* テキスト */}
                <div className="lg:w-1/2">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-blue-500 text-4xl font-bold">
                      {questionNumber}
                    </span>
                    <h3 className="text-blue-500 text-xl lg:text-2xl font-bold leading-tight">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
