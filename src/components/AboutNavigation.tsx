import React from 'react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '会社概要', path: '/about/profile', row: 1 },
  { label: '事業内容', path: '/business', row: 1 },
  { label: 'Meta Heroes\nの使命', path: '/about/mission', row: 2 },
  { label: 'Meta Heroes\nについて', path: '/about/company', row: 2 },
  { label: '事業所・施設', path: '/about/offices', row: 2 },
  { label: '行動規範', path: '/about/conduct', row: 3 },
  { label: 'メンバー紹介', path: '/members', row: 3 },
  { label: 'グループ会社', path: '/about/group', row: 3 },
];

export const AboutNavigation: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-6 gap-4 md:gap-6">
          {NAV_ITEMS.map((item, idx) => {
            const isRow1 = item.row === 1;
            const colSpan = isRow1 ? 'col-span-3' : 'col-span-2';
            const isHash = item.path.includes('#');
            
            const content = (
              <div className="flex items-center justify-between w-full px-8 py-8">
                <span className="text-base md:text-lg font-bold text-gray-800 whitespace-pre-line leading-tight">
                  {item.label}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            );

            const className = `group relative bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 flex items-center justify-center border border-gray-50 ${colSpan}`;

            // Use anchor tag for in-page hash links to support smooth scroll or external routing with hash
            if (isHash) {
              return (
                <a key={idx} href={item.path} className={className}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={idx} to={item.path} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
