import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, Blog } from '../lib/microcms';
import { Search, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';

const PLACEHOLDER_IMAGE = '/assets/top/business_bg.png';

type Mode = 'all' | 'cases' | 'works';

interface ServiceFilter {
  key: string;
  label: string;
  categoryIds: string[];
}

// サービス → 関連カテゴリ（サービスカテゴリ自身 + 紐づく「X 実績」カテゴリ）
const SERVICE_FILTERS: ServiceFilter[] = [
  { key: 'xr-solution', label: 'XRソリューション', categoryIds: ['XRソリューション', 'メタバース開発実績'] },
  { key: 'holoshare', label: 'holoshare', categoryIds: ['holoshare', 'メタバース開発実績'] },
  { key: 'hero-aivo', label: 'HERO AIVO', categoryIds: ['HERO AIVO', 'AI / 開発 実績'] },
  { key: 'ai-training', label: 'AI人材育成研修', categoryIds: ['AI人材育成研修', 'AI / 開発 実績'] },
  { key: 'disaster-metaverse', label: '防災メタバース', categoryIds: ['防災メタバース', 'メタバース開発実績'] },
  { key: 'disaster-expo', label: '防災万博 / こども防災万博', categoryIds: ['防災万博 / こども防災万博', 'イベント実績'] },
  { key: 'game-camp', label: 'ゲームメイキングキャンプ', categoryIds: ['ゲームメイキングキャンプ', 'Hero Egg 実績'] },
  { key: 'hero-egg', label: 'Hero Egg', categoryIds: ['Hero Egg', 'Hero Egg 実績'] },
  { key: 'ghs', label: 'GLOBAL HERO SUMMIT', categoryIds: ['GLOBAL HERO SUMMIT', 'イベント実績'] },
  { key: 'egg-jam', label: 'EGG JAM', categoryIds: ['EGG JAM', 'イベント実績'] },
  { key: 'ai-monday', label: 'AI MONDAY', categoryIds: ['AI MONDAY', 'イベント実績'] },
  { key: 'game-event', label: 'ゲーム × イベント', categoryIds: ['ゲーム × イベント', 'イベント実績'] },
  { key: 'mh-guild', label: 'Meta Heroes Guild', categoryIds: ['Meta Heroes Guild', 'イベント実績'] },
  { key: 'speaking', label: 'セミナー・ウェビナー・講演・登壇', categoryIds: ['セミナー・ウェビナー・講演・登壇', 'セミナー・ウェビナー・講演・登壇 実績'] },
];

// 全サービス関連カテゴリの集合（モード判定用）
const ALL_SERVICE_CATEGORIES = Array.from(
  new Set(SERVICE_FILTERS.flatMap(s => s.categoryIds))
);

const isWorksItem = (item: Blog): boolean =>
  !!item.category_new?.some(c => c.includes('実績'));

const isCaseItem = (item: Blog): boolean =>
  !!item.category_new?.some(c => ALL_SERVICE_CATEGORIES.includes(c) && !c.includes('実績'));

export const WorksPage: React.FC = () => {
  const [items, setItems] = useState<Blog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState<Mode>('all');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const limit = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 30 : 10;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        const service = SERVICE_FILTERS.find(s => s.key === selectedService);

        // サーバー側カテゴリ絞り込み: 選択サービスがあればそのカテゴリ、無ければ全サービス関連カテゴリ
        const categoryId: string[] = service ? service.categoryIds : ALL_SERVICE_CATEGORIES;

        const response = await getBlogs(limit, undefined, {
          categoryId,
          year: selectedYear,
          keyword: searchQuery,
        }, offset);

        // クライアント側でモード絞り込み
        const filtered = (response.contents || []).filter((item: Blog) => {
          if (mode === 'works') return isWorksItem(item);
          if (mode === 'cases') return isCaseItem(item) && !isWorksItem(item);
          return isWorksItem(item) || isCaseItem(item);
        });

        setItems(filtered);
        setTotalCount(response.totalCount || 0);
      } catch (error) {
        console.error('Failed to fetch works/cases:', error);
        setItems([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchItems, 500);
    return () => clearTimeout(timer);
  }, [mode, selectedService, selectedYear, searchQuery, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [mode, selectedService, selectedYear, searchQuery]);

  const totalPages = Math.ceil(totalCount / limit);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const getItemTypeLabel = (item: Blog): string => {
    if (isWorksItem(item)) return '実績';
    if (isCaseItem(item)) return '導入事例';
    return '';
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i + 1).toString());

  const MODE_TABS: { id: Mode; label: string }[] = [
    { id: 'all', label: 'すべて' },
    { id: 'cases', label: '導入事例' },
    { id: 'works', label: '実績' },
  ];

  return (
    <main className="min-h-screen bg-white relative z-10 pt-20">
      <PageHero
        titleEn="WORKS & CASES"
        titleJa="事例・実績"
      />

      <div className="container mx-auto px-4 sm:px-8 pb-32">
        {/* Mode Toggle */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="inline-flex bg-gray-50 rounded-full p-1">
            {MODE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`px-6 md:px-8 py-2.5 rounded-full text-[11px] md:text-xs font-black tracking-widest transition-all duration-300 ${
                  mode === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-100 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Service Select */}
            <div className="relative min-w-[260px]">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
              >
                <option value="">SERVICE: ALL</option>
                {SERVICE_FILTERS.map((service) => (
                  <option key={service.key} value={service.key}>
                    {service.label.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            {/* Year Select */}
            <div className="relative min-w-[160px]">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
              >
                <option value="">YEAR</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div className="relative flex-grow lg:w-72 w-full">
            <input
              type="text"
              placeholder="SEARCH"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          </div>
        </div>

        {/* Grid Content */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-gray-400 font-black text-sm tracking-[0.2em] uppercase">No items found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {items.map((item: Blog) => {
                  const typeLabel = getItemTypeLabel(item);
                  return (
                    <Link key={item.id} to={`/news/${item.id}`} className="group block">
                      <div className="relative aspect-video overflow-hidden mb-6 bg-gray-100 rounded-sm">
                        <img
                          src={item.eyecatch?.url || PLACEHOLDER_IMAGE}
                          alt=""
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        {typeLabel && (
                          <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-black tracking-widest rounded-full backdrop-blur-md ${
                            typeLabel === '実績'
                              ? 'bg-blue-600/90 text-white'
                              : 'bg-white/90 text-blue-600'
                          }`}>
                            {typeLabel}
                          </span>
                        )}
                      </div>
                      <div className="space-y-4 px-1">
                        <time className="text-[10px] font-black text-gray-300 tracking-[0.2em] font-mono block">
                          {formatDate(item.publishedAt)}
                        </time>
                        <h3 className="text-gray-900 text-base font-black leading-relaxed line-clamp-2 group-hover:text-blue-600 transition-colors tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 rotate-90 group-hover:text-blue-600" />
                  </button>

                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page: number | string, idx: number) => (
                      <React.Fragment key={idx}>
                        {page === '...' ? (
                          <span className="w-8 text-center text-gray-300 font-bold">...</span>
                        ) : (
                          <button
                            onClick={() => setCurrentPage(Number(page))}
                            className={`w-12 h-12 rounded-full text-xs font-black transition-all ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90 group-hover:text-blue-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};
