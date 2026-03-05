import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { galleryItems, GalleryItem } from '../data/gallery';

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const GalleryPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(galleryItems.map(item => item.category.toUpperCase()));
    return ['ALL', ...Array.from(cats)].sort();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesFilter = filter === 'ALL' || item.category.toUpperCase() === filter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const handleItemClick = (item: GalleryItem) => {
    if (item.type === 'video') {
      setPlayingId(item.id);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <main className="bg-white min-h-screen text-gray-900 pb-32">
      <PageHero 
        titleEn="GALLERY" 
        titleJa="実績ギャラリー"
      />
      
      <div className="container mx-auto px-4 md:px-8">
        {/* Filter & Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setPlayingId(null);
                }}
                className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="実績を検索"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPlayingId(null);
              }}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-full text-xs font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          </div>
        </div>

        {/* Simple Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const youtubeId = item.youtubeUrl ? getYouTubeId(item.youtubeUrl) : null;
            const thumbnailUrl = item.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '');
            const isPlaying = playingId === item.id;

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <div 
                  className="relative aspect-video rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 bg-gray-100 border border-gray-100 cursor-pointer"
                  onClick={() => !isPlaying && handleItemClick(item)}
                >
                  {isPlaying && item.type === 'video' ? (
                    <div className="absolute inset-0 bg-black">
                      {item.youtubeUrl ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media; fullscreen"
                          title={item.title}
                        />
                      ) : (
                        <video src={item.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                      )}
                    </div>
                  ) : (
                    <>
                      <img 
                        src={thumbnailUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Play Icon Overlay for Videos */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6 ml-1">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-sm text-[9px] font-black text-white tracking-widest uppercase">
                        {item.category}
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 px-1">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold">該当する実績が見つかりませんでした。</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                selectedItem.youtubeUrl ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.youtubeUrl)}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen"
                    title={selectedItem.title}
                  />
                ) : selectedItem.videoUrl ? (
                  <video 
                    src={selectedItem.videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : null
              ) : (
                <img 
                  src={selectedItem.thumbnail} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-contain"
                />
              )}
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};