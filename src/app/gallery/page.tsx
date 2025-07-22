'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Grid3X3, 
  List,
  MapPin,
  Calendar,
  Camera,
  Heart,
  Share2,
  Download,
  Eye
} from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  location?: string;
  category: string;
  tags: string[];
  photographer?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const GALLERY_IMAGES_QUERY = `
  query GetPublicGalleryImages($filters: GalleryImageFilters, $limit: Int, $offset: Int) {
    galleryImages(filters: $filters, limit: $limit, offset: $offset) {
      id
      title
      description
      imageUrl
      thumbnailUrl
      altText
      location
      category
      tags
      photographer
      featured
      published
      createdAt
      updatedAt
    }
  }
`;

const categories = [
  { id: 'all', name: 'All Photos', value: '' },
  { id: 'destinations', name: 'Destinations', value: 'DESTINATIONS' },
  { id: 'tours', name: 'Tours', value: 'TOURS' },
  { id: 'culture', name: 'Culture', value: 'CULTURE' },
  { id: 'wildlife', name: 'Wildlife', value: 'WILDLIFE' },
  { id: 'landscapes', name: 'Landscapes', value: 'LANDSCAPES' },
  { id: 'people', name: 'People', value: 'PEOPLE' },
  { id: 'food', name: 'Food', value: 'FOOD' },
  { id: 'activities', name: 'Activities', value: 'ACTIVITIES' }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGalleryImages();
  }, [selectedCategory]);

  const loadGalleryImages = async () => {
    try {
      setIsLoading(true);
      
      const filters: any = {
        published: true // Only show published images on public gallery
      };
      
      if (selectedCategory !== 'all') {
        const categoryValue = categories.find(cat => cat.id === selectedCategory)?.value;
        if (categoryValue) {
          filters.category = categoryValue;
        }
      }

      const result = await graphqlClient.request(GALLERY_IMAGES_QUERY, {
        filters,
        limit: 100,
        offset: 0
      });

      setFilteredImages(result.galleryImages || []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      // Fallback to empty array if API fails
      setFilteredImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % filteredImages.length
      : (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleShare = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-500/5 to-yellow-500/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-6">
              Travel Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the beauty of Africa through our curated collection of stunning photography. 
              From wildlife safaris to cultural experiences, explore the continent's diverse landscapes and rich heritage.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                <span>{filteredImages.length} Photos</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Multiple Locations</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>High Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = category.id === 'all' 
                  ? filteredImages.length 
                  : filteredImages.filter(img => img.category === category.value).length;
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name} ({count})
                  </motion.button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'masonry'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                      viewMode === 'masonry' && index % 3 === 1 ? 'row-span-2' : ''
                    }`}
                    onClick={() => openLightbox(image, index)}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
                      <Image
                        src={image.imageUrl}
                        alt={image.altText}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{image.location}</span>
                        </div>
                        <p className="text-sm opacity-80 line-clamp-2">{image.description}</p>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full capitalize">
                          {image.category}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                          className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                        <button className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200">
                          <Heart className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Image */}
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedImage.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedImage.photographer && (
                    <div className="flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      <span>{selectedImage.photographer}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-200 mb-4">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} of {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
