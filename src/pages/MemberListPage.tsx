import React from 'react';
import { Link } from 'react-router-dom';
import { allMembers } from '../data/members';
import { motion } from 'framer-motion';
import { MemberCategory } from '../types/member';
import { PageHero } from '../components/PageHero';

const CATEGORIES: MemberCategory[] = [
  'コンテンツプロデュース',
  'クリエイティブ',
  'セールス',
  'ビジネスプロデュース',
  'コーポレート'
];

export const MemberListPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pb-24">
      <PageHero 
        titleEn="MEMBER INTRODUCTION" 
        titleJa="メンバー紹介"
      />

      <div className="container mx-auto px-4 sm:px-8">
        <div className="space-y-20">
          {CATEGORIES.map((category) => {
            const membersInCategory = allMembers.filter(m => m.category === category);
            if (membersInCategory.length === 0) return null;

            return (
              <section key={category}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-12 max-w-5xl mx-auto">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-cyan-600 tracking-wider">
                    {category}
                  </h2>
                  <div className="flex-grow h-px bg-gradient-to-r from-gray-100 to-transparent ml-4" />
                </div>

                {/* Member Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 sm:gap-x-12 sm:gap-y-20 max-w-5xl mx-auto">
                  {membersInCategory.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={`/member/${member.id}`}
                        className="group block text-left"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-square mb-6">
                          <div className="w-full h-full rounded-[2rem] bg-gray-50 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                            <div className="w-full h-full rounded-[2rem] overflow-hidden">
                              <img 
                                src={member.icon} 
                                alt={member.name}
                                className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-1 px-2 transition-transform duration-500 group-hover:-translate-y-1">
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                            {member.name}
                          </h2>
                          <p className="text-sm sm:text-base text-cyan-600 font-medium tracking-wider mb-2 font-sans">
                            {member.nameEn}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase pt-1 border-t border-gray-100 group-hover:border-gray-200 transition-colors inline-block pr-4">
                            {member.role}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};
