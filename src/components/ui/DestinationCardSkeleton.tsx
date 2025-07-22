'use client';

import { motion } from 'framer-motion';

export default function DestinationCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl"
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Overlay Skeleton */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Destination Name Skeleton */}
          <div className="h-6 bg-white/20 rounded mb-2 animate-pulse"></div>
          
          {/* Tours Count Skeleton */}
          <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}

export function DestinationsSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}
