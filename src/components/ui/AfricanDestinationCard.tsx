'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface AfricanDestinationCardProps {
  destination: {
    id: string;
    name: string;
    country: string;
    continent: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceFrom: number;
    duration: string;
    featured: boolean;
    slug: string;
  };
  index?: number;
  className?: string;
}

// Map African destinations to our hero images
const getAfricanHeroImage = (destinationName: string, fallbackImage: string) => {
  const imageMap: { [key: string]: string } = {
    'serengeti': '/images/destinations/serengeti-migration.jpg',
    'kilimanjaro': '/images/destinations/kilimanjaro-sunrise.jpg',
    'victoria falls': '/images/destinations/victoria-falls.jpg',
    'zanzibar': '/images/destinations/zanzibar-beach.jpg',
    'cape town': '/images/destinations/cape-town-table-mountain.jpg',
    'masai mara': '/images/destinations/masai-mara-balloon.jpg',
    'kruger': '/images/destinations/kruger-national-park.jpg',
    'sossusvlei': '/images/destinations/sossusvlei-dunes.jpg',
    'sahara': '/images/destinations/sahara-desert-morocco.jpg',
    'pyramids': '/images/destinations/pyramids-giza-egypt.jpg'
  };

  const lowerName = destinationName.toLowerCase();
  for (const [key, image] of Object.entries(imageMap)) {
    if (lowerName.includes(key)) {
      return image;
    }
  }

  // If no match found, return fallback or a random African image
  if (fallbackImage && !fallbackImage.includes('placeholder')) {
    return fallbackImage;
  }
  
  // Return a random African destination image as fallback
  const randomImages = Object.values(imageMap);
  return randomImages[Math.floor(Math.random() * randomImages.length)];
};

export default function AfricanDestinationCard({ 
  destination, 
  index = 0, 
  className 
}: AfricanDestinationCardProps) {
  const heroImage = getAfricanHeroImage(destination.name, destination.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300",
        className
      )}
    >
      <Link href={`/destinations/${destination.slug}`}>
        {/* Featured Badge */}
        {destination.featured && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={heroImage}
            alt={`${destination.name}, ${destination.country} - Experience Africa's beauty`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-neutral-900">
              {destination.rating.toFixed(1)}
            </span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-full px-3 py-1 flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {destination.country}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {destination.name}
              </h3>
              <p className="text-neutral-600 text-sm mt-1">
                {destination.continent}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
          </div>

          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {destination.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{destination.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{destination.reviewCount} reviews</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(destination.priceFrom)}
              </span>
              <span className="text-neutral-500 text-sm ml-1">per person</span>
            </div>
            <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              From {destination.country}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
