import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DepthCarouselProps {
  images: string[];
  autoplayInterval?: number;
}

export const DepthCarousel: React.FC<DepthCarouselProps> = ({ images, autoplayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [images.length, autoplayInterval]);

  if (images.length === 0) {
    return <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">No images</div>;
  }

  const getStyle = (index: number) => {
    const total = images.length;
    const diff = (index - currentIndex + total) % total;
    
    // We only show a limited number of items to create depth (e.g., 3 items)
    if (diff === 0) {
      return { zIndex: 3, scale: 1, x: 0, opacity: 1, filter: 'blur(0px)' }; // Active
    }
    if (diff === 1 || diff === -(total - 1)) {
      return { zIndex: 2, scale: 0.85, x: '20%', opacity: 0.6, filter: 'blur(4px)' }; // Right
    }
    if (diff === total - 1 || diff === -1) {
      return { zIndex: 2, scale: 0.85, x: '-20%', opacity: 0.6, filter: 'blur(4px)' }; // Left
    }
    // Hidden items
    return { zIndex: 1, scale: 0.7, x: 0, opacity: 0, filter: 'blur(8px)' };
  };

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center perspective-[1000px] overflow-hidden">
      <AnimatePresence>
        {images.map((img, index) => {
          const style = getStyle(index);
          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                zIndex: style.zIndex,
                scale: style.scale,
                x: style.x,
                opacity: style.opacity,
                filter: style.filter
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-[70%] h-[80%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer"
              onClick={() => setCurrentIndex(index)}
            >
              <img src={img} alt={`Carousel ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/80 to-transparent opacity-50" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
