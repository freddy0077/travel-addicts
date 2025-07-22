'use client';

import { motion } from 'framer-motion';

export default function TourCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-medium overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        
        {/* Destination */}
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        
        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Duration and Group Size */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedToursSkeletonSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Tours Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center mt-12">
          <div className="h-12 bg-gray-200 rounded-full w-40 mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
