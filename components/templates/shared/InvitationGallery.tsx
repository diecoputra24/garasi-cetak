'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbox } from './Lightbox';

interface InvitationGalleryProps {
  images: string[];
  fixImageUrl: (url: string) => string;
}

export const InvitationGallery: React.FC<InvitationGalleryProps> = ({ images, fixImageUrl }) => {
  const [selectedImg, setSelectedImg] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full">
        {images.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.1 }}
            onClick={() => setSelectedImg(i)}
            className="relative rounded-xl overflow-hidden shadow-md border-4 border-white aspect-square cursor-pointer"
          >
            <img 
              src={fixImageUrl(url)} 
              alt="gallery" 
              className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
            />
          </motion.div>
        ))}
      </div>

      <Lightbox 
        images={images} 
        initialIndex={selectedImg} 
        onClose={() => setSelectedImg(null)} 
        fixImageUrl={fixImageUrl} 
      />
    </>
  );
};
