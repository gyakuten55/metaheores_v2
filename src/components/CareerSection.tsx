import { useState } from 'react';
import { CareerItem } from '../types/member';

interface CareerSectionProps {
  career: CareerItem[];
}

export const CareerSection = ({ career }: CareerSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(1); // 初期は真ん中（Past）

  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < career.length - 1 ? prev + 1 : prev));
  };

  return (
    <section className="bg-gray-100 py-24">
      <div className="container mx-auto px-8 lg:px-24 max-w-6xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">キャリア</span>
        </div>

        {/* タイトル */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-16">
          これまでの歩み
        </h2>

        {/* カードスライダー */}
        <div className="relative">
          {/* 左矢印 */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-cyan-500 hover:text-cyan-600 transition-colors disabled:opacity-30"
            aria-label="前へ"
            disabled={activeIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* カードコンテナ */}
          <div className="overflow-hidden mx-12">
            <div
              className="flex items-center gap-8 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(50% - ${activeIndex * (450 + 32)}px - 225px))`,
              }}
            >
              {career.map((item, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[450px] transition-all duration-300 ${
                    index === activeIndex
                      ? 'scale-100 opacity-100 z-10'
                      : 'scale-75 opacity-50'
                  }`}
                >
                  {/* ラベル */}
                  <span className="text-cyan-500 font-bold text-5xl block relative z-10 ml-4">
                    {item.label}
                  </span>

                  {/* カード */}
                  <div className="bg-white rounded-3xl p-10 shadow-lg min-h-[400px] -mt-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      {item.title}
                    </h3>
                    <div className="space-y-4">
                      {item.description.map((text, i) => (
                        <p key={i} className="text-gray-600 text-lg leading-relaxed">
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右矢印 */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-cyan-500 hover:text-cyan-600 transition-colors disabled:opacity-30"
            aria-label="次へ"
            disabled={activeIndex === career.length - 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
