import { ScheduleItem } from '../types/member';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
}

export const ScheduleSection = ({ schedule }: ScheduleSectionProps) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-8 lg:px-24 max-w-4xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">働き方</span>
        </div>

        {/* タイトル */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-16">
          1日のスケジュール
        </h2>

        {/* タイムライン */}
        <div className="relative">
          {schedule.map((item, index) => (
            <div key={index} className="flex gap-8 mb-8 last:mb-0">
              {/* 時間 */}
              <div className="w-16 text-right text-gray-500 font-medium pt-1 flex-shrink-0">
                {item.time}
              </div>

              {/* タイムラインマーカー */}
              <div className="relative flex flex-col items-center">
                {/* 円マーカー */}
                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 bg-white z-10 flex-shrink-0"></div>
                {/* 縦線 */}
                {index < schedule.length - 1 && (
                  <div className="w-0.5 bg-cyan-200 flex-grow absolute top-5 bottom-0 left-1/2 -translate-x-1/2" style={{ height: 'calc(100% + 2rem)' }}></div>
                )}
              </div>

              {/* コンテンツ */}
              <div className="flex-grow pb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-600 bg-gray-100 rounded-lg px-4 py-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
