import { Stat } from '../types/member';

interface StatCardProps {
  stat: Stat;
}

export const StatCard = ({ stat }: StatCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-5 border border-gray-100 rounded-3xl bg-white min-w-[200px] shadow-lg">
      <div className="flex items-baseline gap-1">
        <span className="text-6xl lg:text-7xl font-bold text-blue-500 whitespace-nowrap">{stat.value}</span>
        {stat.suffix && (
          <span className="text-2xl font-medium text-gray-800 whitespace-nowrap">{stat.suffix}</span>
        )}
      </div>
      <span className="text-base text-gray-500 mt-3 whitespace-nowrap">{stat.label}</span>
    </div>
  );
};
