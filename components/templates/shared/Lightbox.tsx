'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  initialIndex: number | null;
  onClose: () => void;
  fixImageUrl: (url: string) => string;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose, fixImageUrl }) => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(initialIndex);

  useEffect(() => {
    setMounted(true);
    setCurrentIndex(initialIndex);
    
    if (initialIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [initialIndex]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % images.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-0 m-0"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[10000] p-2 bg-black/20 rounded-full backdrop-blur-md"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[10000] p-2"
            onClick={handlePrev}
          >
            <ChevronLeft size={48} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[10000] p-2"
            onClick={handleNext}
          >
            <ChevronRight size={48} />
          </button>

          {/* Main Image */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fixImageUrl(images[currentIndex])}
              alt="gallery-detail"
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
            
            {/* Counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-xs font-bold tracking-[0.3em] uppercase">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
