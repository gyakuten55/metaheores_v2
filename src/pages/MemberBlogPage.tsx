import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Blog, Category, getMemberBlogs, getMemberCategories } from '../lib/microcms';
import { PageHero } from '../components/PageHero';

export const MemberBlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // PC: 30, Mobile: 10
  const limit = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 30 : 10;

  // カテゴリ（人物）取得
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getMemberCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // ブログ取得
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        const response = await getMemberBlogs(
          limit, 
          {
            keyword: searchQuery,
            categoryId: selectedCategory
          },
          offset
        );
        
        setBlogs(response.contents || []);
        setTotalCount(response.totalCount || 0);
      } catch (error) {
        console.error('Failed to fetch member blogs', error);
        setBlogs([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, currentPage, limit]);

  // フィルタ変更時に1ページ目に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(totalCount / limit);

  const getPageNumbers = () => {
    const pages = [];
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

  return (
    <div className="min-h-screen bg-white">
      <PageHero 
        titleEn="MEMBER BLOG" 
        titleJa="メンバーブログ"
      />
      
      <div className="container mx-auto px-4 sm:px-8 pb-32">
        {/* Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-100 pb-12 max-w-7xl mx-auto">
          {/* Filter Group */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Category Select (Member Name) */}
            <div className="relative min-w-[240px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
              >
                <option value="">MEMBER: ALL</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-grow lg:w-72 w-full">
            <input
              type="text"
              placeholder="SEARCH BLOGS"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          </div>
        </div>

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
             <div className="flex justify-center items-center py-32">
               <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
             </div>
          ) : blogs.length === 0 ? (
             <div className="text-center py-32">
               <p className="text-gray-300 font-black text-sm tracking-[0.2em] uppercase">No articles found.</p>
             </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                {blogs.map((item) => (
                  <Link key={item.id} to={`/member-blog/${item.id}`} className="group flex flex-col h-full">
                    {/* Eyecatch */}
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 mb-6 shadow-sm border border-gray-50">
                      <img 
                        src={item.eyecatch?.url || '/assets/top/business_bg.png'} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-blue-500 group-hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                        <time className="text-[10px] font-black text-gray-400 tracking-[0.2em] font-mono">
                          {formatDate(item.publishedAt)}
                        </time>
                      </div>
                      
                      <h3 className="text-base font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 tracking-tight leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </motion.div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 rotate-90 group-hover:text-blue-600" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page, idx) => (
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
    </div>
  );
};