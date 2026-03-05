import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 動画データ定義 (初期値)
const INITIAL_VIDEOS = [
  { 
    id: '5VnxVYHR4A4', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/5VnxVYHR4A4/maxresdefault.jpg'
  },
  { 
    id: '7qmtXERUG5o', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/7qmtXERUG5o/maxresdefault.jpg'
  },
  { 
    id: '7thymifNrbE', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/7thymifNrbE/maxresdefault.jpg'
  },
  { 
    id: 'HwBMWaO27I8', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/HwBMWaO27I8/maxresdefault.jpg'
  },
  { 
    id: 'k2NCdmsgN74', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/k2NCdmsgN74/maxresdefault.jpg'
  },
  { 
    id: 'M4SG299zjBE', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/M4SG299zjBE/maxresdefault.jpg'
  },
  { 
    id: 'Qe6t5_rPVBc', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/Qe6t5_rPVBc/maxresdefault.jpg'
  },
  { 
    id: 'TizqV76FOsg', 
    title: 'Loading...',
    thumbnail: 'https://img.youtube.com/vi/TizqV76FOsg/maxresdefault.jpg'
  }
];

export const MovieSection: React.FC = () => {
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // コンポーネントマウント時にタイトルを取得
  useEffect(() => {
    const fetchTitles = async () => {
      const updatedVideos = await Promise.all(
        INITIAL_VIDEOS.map(async (video) => {
          try {
            const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${video.id}`);
            const data = await response.json();
            return {
              ...video,
              title: data.title || video.title 
            };
          } catch (error) {
            console.error(`Failed to fetch title for video ${video.id}`, error);
            return video;
          }
        })
      );
      setVideos(updatedVideos);
    };

    fetchTitles();
  }, []);

  const nextSlide = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPlayingVideoId(null); // スライド移動したら再生停止
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setPlayingVideoId(null); // スライド移動したら再生停止
    }
  };

  return (
    <section className="relative z-20 -mt-24 bg-transparent pb-0">
      {/* メインコンテナ */}
      <div className="bg-white rounded-t-[60px] md:rounded-t-[100px] pt-8 md:pt-16 pb-12 md:pb-20 relative overflow-hidden shadow-[-10px_-10px_30px_rgba(0,0,0,0.1)]">
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 block mb-1 uppercase font-sans">
              MOVIE
            </span>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">動画</h2>
              <div className="w-8 h-0.5 bg-blue-600" />
            </div>
          </div>

          {/* Carousel Area */}
          <div className="relative max-w-[1200px] mx-auto h-[320px] md:h-[500px] flex items-center justify-center mb-6 md:mb-10">
            
            {/* Prev Button */}
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-[5%] md:left-[10%] lg:left-[15%] z-50 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#5DBCF5] transition-all duration-300
                ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 opacity-100'}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-5 h-5 md:w-7 md:h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Next Button */}
            <button 
              onClick={nextSlide}
              disabled={currentIndex === videos.length - 1}
              className={`absolute right-[5%] md:right-[10%] lg:right-[15%] z-50 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#5DBCF5] transition-all duration-300
                ${currentIndex === videos.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 opacity-100'}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-5 h-5 md:w-7 md:h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Slides */}
            <div className="w-full h-full flex items-center justify-center relative perspective-1000">
              <AnimatePresence initial={false} mode="popLayout">
                {[-1, 0, 1].map((offset) => {
                  const index = currentIndex + offset;
                  const video = videos[index];

                  if (!video) return null;

                  const isCenter = offset === 0;

                  return (
                    <motion.div
                      key={video.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, { offset, velocity }) => {
                        const swipe = offset.x;
                        if (swipe < -50 || velocity.x < -500) {
                          nextSlide();
                        } else if (swipe > 50 || velocity.x > 500) {
                          prevSlide();
                        }
                      }}
                      initial={{ 
                        scale: 0.9, 
                        x: offset * 110 + '%',
                        opacity: isCenter ? 1 : 0.6,
                        zIndex: isCenter ? 20 : 10
                      }}
                      animate={{ 
                        scale: isCenter ? 1 : 0.8,
                        x: offset * (window.innerWidth < 768 ? 95 : 75) + '%',
                        opacity: isCenter ? 1 : 0.4,
                        zIndex: isCenter ? 20 : 10
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="absolute w-[85%] md:w-[70%] max-w-[700px] cursor-grab active:cursor-grabbing"
                    >
                      {/* Video Card Container */}
                      <div className={`
                        bg-white rounded-[24px] overflow-hidden transition-all duration-300
                        border-[3px] shadow-xl
                        ${isCenter ? 'border-[#5DBCF5]' : 'border-[#5DBCF5]'}
                      `}>
                        
                        {/* Video/Thumbnail Area */}
                        <div className="relative aspect-video bg-black group">
                          {playingVideoId === video.id ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                            />
                          ) : (
                            <div 
                              className="absolute inset-0 cursor-pointer"
                              onClick={() => isCenter && setPlayingVideoId(video.id)} // 中央の動画のみ再生可能に
                            >
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                              {/* Play Icon */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-[2px] border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white ml-1">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Title Area */}
                        <div className="py-3 md:py-6 px-4 text-center bg-white min-h-[3.5rem] md:min-h-[5rem] flex items-center justify-center">
                          <h3 className="text-sm md:text-xl font-bold text-gray-800 tracking-wide line-clamp-2">
                            {video.title}
                          </h3>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Character Image - PC表示の時さらに右上へ調整 */}
              <div className="absolute top-[30%] md:top-[2%] left-[-35%] md:left-[-38%] w-[100%] md:w-[100%] pointer-events-none z-30">
                {/* Shadow effect */}
                <div className="absolute bottom-12 left-12 right-12 h-12 bg-black/20 blur-[50px] rounded-[100%]" />
                <img
                  src="/assets/top/egg_chara_test.gif"
                  alt=""
                  className="w-full h-auto relative drop-shadow-2xl rotate-[-5deg]"
                />
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center relative z-40">
            <a
              href="https://youtube.com/playlist?list=PL6tegUkHuPE3k536xqJEzWdS2M8uUXvNt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-14 py-4 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#5DBCF5] text-white font-bold text-base tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              もっと見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
