import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, Blog, Category, getCategoryOptions } from '../lib/microcms';
import { Search, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';

const PLACEHOLDER_IMAGE = '/assets/top/business_bg.png';

export const WorksPage: React.FC = () => {
  const [works, setWorks] = useState<Blog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // PC: 30, Mobile: 10
  const limit = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 30 : 10;

  // カテゴリ取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const options = await getCategoryOptions();
        const filtered = options.filter((cat: Category) => cat.name.includes('実績'));
        setCategories(filtered);
      } catch (e) {
        console.warn('Failed to load categories for works:', e);
      }
    };
    fetchCategories();
  }, []);

  // 実績取得
  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        const response = await getBlogs(limit, undefined, {
          categoryId: selectedCategory,
          year: selectedYear,
          keyword: searchQuery
        }, offset);
        
        // カテゴリ名に「実績」が含まれる記事のみを表示
        const filteredWorks = response.contents.filter((item: Blog) => 
          item.category_new?.some((cat: string) => cat.includes('実績'))
        );
        
        setWorks(filteredWorks);
        setTotalCount(response.totalCount || 0);
      } catch (error) {
        console.error('Failed to fetch works:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchWorks();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, searchQuery, currentPage, limit]);

  // フィルタ変更時に1ページ目に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, searchQuery]);

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i + 1).toString());

  return (
    <main className="min-h-screen bg-white relative z-10 pt-20">
      <PageHero 
        titleEn="WORKS" 
        titleJa="実績一覧"
      />
      
      <div className="container mx-auto px-4 sm:px-8 pb-32">
        {/* Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-100 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative min-w-[240px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
              >
                <option value="">CATEGORY: ALL</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

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
              placeholder="SEARCH WORKS"
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
          ) : works.length === 0 ? (
             <div className="text-center py-32">
               <p className="text-gray-400 font-black text-sm tracking-[0.2em] uppercase">No works found.</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {works.map((item: Blog) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group block">
                    <div className="relative aspect-video overflow-hidden mb-6 bg-gray-100 rounded-sm">
                      <img 
                        src={item.eyecatch?.url || PLACEHOLDER_IMAGE} 
                        alt="" 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                      />
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
                ))}
              </div>

              {/* Pagination UI */}
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
