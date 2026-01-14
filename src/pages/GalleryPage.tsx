import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { galleryItems, GalleryItem } from '../data/gallery';

// --- Components ---

// Hexagon SVG Path (Pointy topped)
// Polygon for CSS clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)
const HEX_CLIP_PATH = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

interface HexProps {
  item: GalleryItem;
  x: number;
  y: number;
  width: number;
  height: number;
  mouseX: any;
  mouseY: any;
  onClick: (item: GalleryItem) => void;
}

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Hexagon: React.FC<HexProps> = ({ item, x, y, width, height, mouseX, mouseY, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Calculate distance from mouse to center of this hex
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // Use framer-motion transforms based on mouse position
  const distance = useTransform<number, number>(
    [mouseX, mouseY],
    ([mx, my]: number[]) => {
      const dx = mx - centerX;
      const dy = my - centerY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  );

  // Map distance to scale/z-index
  const scale = useTransform(distance, [0, 300], [1.15, 1]);
  const zIndex = useTransform(distance, [0, 300], [10, 1]);
  const shadowOpacity = useTransform(distance, [0, 300], [0.3, 0.1]);
  
  // Smooth out the spring animation
  const springScale = useSpring(scale, { stiffness: 150, damping: 20 });

  const youtubeId = item.youtubeUrl ? getYouTubeId(item.youtubeUrl) : null;

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        scale: springScale,
        zIndex,
        cursor: 'pointer',
        filter: useTransform(shadowOpacity, (o) => `drop-shadow(0 20px 30px rgba(0,0,0,${o}))`),
      }}
      onClick={() => onClick(item)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
    >
      {/* Border Layer (Gradient) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500"
        style={{ clipPath: HEX_CLIP_PATH }}
      />
      
      {/* Content Layer */}
      <div 
        className="absolute inset-[2px] overflow-hidden bg-white"
        style={{ clipPath: HEX_CLIP_PATH }}
      >
        {/* Content */}
        {item.type === 'video' ? (
          item.youtubeUrl && youtubeId ? (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3`}
                className="w-full h-full scale-[3.5] pointer-events-none"
                allow="autoplay; encrypted-media"
                title={item.title}
              />
            </div>
          ) : item.videoUrl ? (
             <div className="absolute inset-0">
               <video 
                 src={item.videoUrl} 
                 muted 
                 loop 
                 autoPlay 
                 playsInline 
                 className="w-full h-full object-cover scale-[2.0]"
               />
             </div>
          ) : null
        ) : (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

// --- Main Page ---

export const GalleryPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Mouse Position MotionValues
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || window.innerHeight // fallback
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  // --- Grid Layout Calculation ---
  // Hexagon "Pointy Topped"
  // W = sqrt(3) * size
  // H = 2 * size
  // Horizontal spacing = W
  // Vertical spacing = H * 3/4
  // Offset odd rows by W / 2
  
  // Configuration - Larger Size
  const HEX_SIZE = 120; // Radius (Increased from 80)
  const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE; // ~207px
  const HEX_HEIGHT = 2 * HEX_SIZE; // 240px
  const GAP = 15; // Extra spacing
  
  const layoutItems = useMemo(() => {
    if (dimensions.width === 0) return [];

    // Effective width/height including gap (approximate for the grid logic)
    const colWidth = HEX_WIDTH + GAP;
    const rowHeight = (HEX_HEIGHT * 0.75) + GAP;
    
    // Add safe area/padding to prevent cutoff on hover scale
    const horizontalPadding = 40; 
    const availableWidth = dimensions.width - (horizontalPadding * 2);

    // Calculate max columns that fit
    // Logic: cols * colWidth + (colWidth / 2 for odd row shift) <= availableWidth
    // cols * colWidth <= availableWidth - (colWidth / 2)
    let cols = Math.floor((availableWidth - (colWidth / 2)) / colWidth);
    
    // Ensure at least 1 column
    cols = Math.max(1, cols);

    // Calculate the actual used width of the grid to center it perfectly
    // Even rows width: cols * colWidth - GAP (last item has no gap on right, technically)
    // Odd rows width: shifted by colWidth/2. 
    // The visual bounding box width roughly:
    const gridTotalWidth = (cols * colWidth) + (colWidth / 2) - GAP;
    
    // Center the grid
    const offsetX = (dimensions.width - gridTotalWidth) / 2;

    return galleryItems.map((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = offsetX + (col * colWidth) + ((row % 2) * (colWidth / 2));
      const y = row * rowHeight + 60; // Add top padding

      return {
        item,
        x,
        y,
        width: HEX_WIDTH,
        height: HEX_HEIGHT
      };
    });
  }, [dimensions.width]);

  // Calculate container height based on items
  const containerHeight = useMemo(() => {
    if (layoutItems.length === 0) return 600;
    const lastItem = layoutItems[layoutItems.length - 1];
    return lastItem.y + HEX_HEIGHT + 100;
  }, [layoutItems]);


  return (
    <main className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      <PageHero 
        titleEn="GALLERY" 
        titleJa="実績ギャラリー"
      />
      
      {/* Interactive Grid Container */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: containerHeight }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background ambient light - Subtle for white background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full h-full max-w-[1920px] mx-auto">
          {layoutItems.length > 0 ? (
            layoutItems.map((layout) => (
              <Hexagon
                key={layout.item.id}
                {...layout}
                mouseX={mouseX}
                mouseY={mouseY}
                onClick={setSelectedItem}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-gray-400 font-bold">コンテンツを準備中です。ファイルを src/assets/gallery に追加してください。</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] bg-black rounded shadow-2xl overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                selectedItem.youtubeUrl ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.youtubeUrl)}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0`}
                    className="w-[80vw] h-[45vw] max-h-[80vh] max-w-[160vh]"
                    allow="autoplay; encrypted-media; fullscreen"
                    title={selectedItem.title}
                  />
                ) : selectedItem.videoUrl ? (
                  <video 
                    src={selectedItem.videoUrl} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  />
                ) : null
              ) : (
                <img 
                  src={selectedItem.thumbnail} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
