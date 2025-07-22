'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AfricanHeroProps {
  title?: string;
  subtitle?: string;
  images?: string[];
  showStats?: boolean;
  children?: React.ReactNode;
  className?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

const defaultImages = [
  '/images/destinations/serengeti-migration.jpg',
  '/images/destinations/kilimanjaro-sunrise.jpg',
  '/images/destinations/victoria-falls.jpg',
  '/images/destinations/zanzibar-beach.jpg',
  '/images/destinations/cape-town-table-mountain.jpg'
];

const heightClasses = {
  sm: 'h-96',
  md: 'h-[500px]',
  lg: 'min-h-screen',
  xl: 'h-screen'
};

export default function AfricanHero({
  title = "Discover Africa's Wonders",
  subtitle = "Experience the magic of Africa through authentic adventures and unforgettable journeys",
  images = defaultImages,
  showStats = true,
  children,
  className,
  height = 'lg'
}: AfricanHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 6 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const imageDescriptions = [
    "Witness the Great Migration in Serengeti National Park",
    "Marvel at Mount Kilimanjaro's majestic sunrise",
    "Experience the thundering power of Victoria Falls",
    "Relax on Zanzibar's pristine white sand beaches",
    "Explore Cape Town's iconic Table Mountain"
  ];

  return (
    <section className={cn(
      "relative overflow-hidden flex items-center justify-center",
      heightClasses[height],
      className
    )}>
      {/* Dynamic Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={image}
              alt={imageDescriptions[index] || `African destination ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentImageIndex
                  ? "bg-white scale-110 shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word === "Africa's" || word === "African" ? (
                  <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  word
                )}
                {index < title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {children}
        </motion.div>

        {/* African-themed Stats */}
        {showStats && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">54 African Countries</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">1000+ Wildlife Species</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">Ancient Cultures</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      {height === 'lg' || height === 'xl' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
