import React, { useState } from 'react';
import { PageHero } from '../components/PageHero';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: '応募・選考について',
    items: [
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      }
    ]
  },
  {
    category: '入社後について',
    items: [
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      },
      {
        question: 'テキストテキストテキストテキスト？',
        answer: '回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答'
      }
    ]
  }
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  React.useEffect(() => {
    alert('FAQページは現在準備中です。');
    window.location.href = '/recruit';
  }, []);

  const toggleFAQ = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <PageHero 
        titleEn="FAQ" 
        titleJa="採用に関するFAQ"
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {FAQ_DATA.map((cat, catIdx) => (
            <div key={cat.category} className="mb-20 last:mb-0">
              {/* Category Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
                {cat.category}
              </h2>

              {/* FAQ List */}
              <div className="border-t border-gray-200">
                {cat.items.map((item, itemIdx) => {
                  const isOpen = openIndex === `${catIdx}-${itemIdx}`;
                  return (
                    <div 
                      key={itemIdx} 
                      className="border-b border-gray-200"
                    >
                      <button 
                        onClick={() => toggleFAQ(catIdx, itemIdx)}
                        className="w-full py-6 md:py-8 flex items-center justify-between text-left group"
                      >
                        <div className="flex gap-3 md:gap-4 items-start">
                          <span className="text-lg md:text-xl font-bold text-[#2563eb] mt-0.5">Q.</span>
                          <span className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                            {item.question}
                          </span>
                        </div>
                        <div className="shrink-0 ml-4 text-gray-400">
                          {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          )}
                        </div>
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-10 md:px-14 pb-10 pt-0">
                          <p className="text-sm md:text-base font-medium text-gray-600 leading-loose">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
