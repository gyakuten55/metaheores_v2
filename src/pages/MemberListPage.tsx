import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { allMembers } from '../data/members';
import { motion } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { Blog, getMemberBlogs } from '../lib/microcms';

export const MemberListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const memberScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMemberBlogs(12)
      .then((res) => setBlogs(res.contents))
      .catch((err) => console.error('Failed to fetch member blogs:', err));
  }, []);

  const scrollMembers = (direction: 'left' | 'right') => {
    if (!memberScrollRef.current) return;
    const { scrollLeft, clientWidth } = memberScrollRef.current;
    const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    memberScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <PageHero
        titleEn="MEMBER INTRODUCTION"
        titleJa="メンバー紹介"
      />

      {/* Members Horizontal Scroll */}
      <section className="container mx-auto px-4 sm:px-8 mb-24 md:mb-32">
        <div className="text-center mb-12">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] block mb-1 uppercase text-gray-400">MEMBERS</span>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">メンバー一覧</h2>
            <div className="w-8 h-0.5 bg-blue-600" />
          </div>
        </div>

        <div className="relative">
          <div
            ref={memberScrollRef}
            className="flex gap-4 md:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {allMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex-shrink-0 w-[160px] md:w-[calc((100%-7.5rem)/4)] snap-start"
              >
                <Link to={`/member/${member.id}`} className="group/card block">
                  <div className="aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-lg mb-4 md:mb-6 transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-2xl">
                    <img
                      src={member.icon}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/card:grayscale-0 group-hover/card:scale-105"
                    />
                  </div>
                  <div className="px-2">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-[9px] md:text-xs font-bold text-cyan-600 tracking-wider mb-1.5 md:mb-2">
                      {member.nameEn}
                    </p>
                    <p className="text-[9px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase border-t border-gray-100 pt-1.5 md:pt-2 inline-block pr-4">
                      {member.role}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scrollMembers('left')}
            aria-label="前へ"
            className="absolute left-0 top-[35%] -translate-y-1/2 -translate-x-2 md:-translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => scrollMembers('right')}
            aria-label="次へ"
            className="absolute right-0 top-[35%] -translate-y-1/2 translate-x-2 md:translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section>

      {/* Member Blogs */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] block mb-1 uppercase text-gray-400">MEMBER BLOG</span>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">メンバーブログ一覧</h2>
            <div className="w-8 h-0.5 bg-blue-600" />
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-300 text-sm font-bold tracking-widest">記事を読み込み中...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/member-blog/${blog.id}`} className="group block">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-50 shadow-sm">
                    {blog.eyecatch ? (
                      <img
                        src={blog.eyecatch.url}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-black">MH</span>
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <time className="text-[10px] font-black text-gray-300 tracking-[0.2em] font-mono block mb-2">
                      {formatDate(blog.publishedAt)}
                    </time>
                    <h3 className="text-sm md:text-base font-black text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/members/blog"
            className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors tracking-[0.2em] border-b border-gray-100 hover:border-blue-600 pb-1 uppercase"
          >
            View All
          </Link>
        </div>
      </section>
    </main>
  );
};
