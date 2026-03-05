import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MemberData } from '../types/member';

interface OtherMembersSectionProps {
  currentMemberId: string;
  allMembers: MemberData[];
}

export const OtherMembersSection = ({ currentMemberId, allMembers }: OtherMembersSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 現在のメンバーを除外
  const otherMembers = allMembers.filter(m => m.id !== currentMemberId);

  // Responsive visible count
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const visibleCount = isMobile ? 2 : 5;
  const maxIndex = Math.max(0, otherMembers.length - visibleCount);

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // メンバーが1人以下の場合は表示しない
  if (otherMembers.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-800 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* タイトル */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-10 md:mb-12">
          その他のメンバーを見る
        </h2>

        {/* メンバーカルーセル */}
        <div className="relative flex items-center justify-center">
          {/* 左矢印 */}
          <button
            onClick={goToPrev}
            className="absolute left-[-10px] md:left-4 z-10 text-white hover:text-gray-300 transition-colors disabled:opacity-0"
            disabled={currentIndex === 0}
            aria-label="前へ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* メンバー画像 */}
          <div className="flex gap-3 md:gap-4 overflow-hidden mx-8 md:mx-16">
            {otherMembers.slice(currentIndex, currentIndex + visibleCount).map((member) => (
              <Link
                key={member.id}
                to={`/member/${member.id}`}
                className="flex-shrink-0 w-[calc(50vw-40px)] h-[calc(50vw-40px)] md:w-48 md:h-48 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.scrollTo(0, 0)}
              >
                <img
                  src={member.icon}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                />
              </Link>
            ))}
          </div>

          {/* 右矢印 */}
          <button
            onClick={goToNext}
            className="absolute right-[-10px] md:right-4 z-10 text-white hover:text-gray-300 transition-colors disabled:opacity-0"
            disabled={currentIndex >= maxIndex}
            aria-label="次へ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* ドットインジケーター */}
        <div className="flex justify-center flex-wrap gap-2 mt-8">
          {otherMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                index >= currentIndex && index < currentIndex + visibleCount
                  ? 'bg-cyan-500'
                  : 'bg-gray-500'
              }`}
              aria-label={`スライド ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
