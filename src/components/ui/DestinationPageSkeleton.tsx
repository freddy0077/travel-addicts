import { motion } from 'framer-motion';

export function DestinationPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title and Country */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}

export function DestinationsPageSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <DestinationPageSkeleton key={i} />
      ))}
    </div>
  );
}
