'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Star, Clock, Users, MapPin } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface TourCardProps {
  tour: {
    id: string
    title: string
    destination: string
    image: string
    price: number
    originalPrice?: number
    duration: string
    groupSize: string
    rating: number
    reviewCount: number
    highlights: string[]
    slug: string
    featured?: boolean
  }
  className?: string
}

export default function TourCard({ tour, className }: TourCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = tour.originalPrice 
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={cn(
        'bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className={cn(
            'object-cover group-hover:scale-105 transition-transform duration-500',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Featured badge */}
        {tour.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
            Featured
          </div>
        )}
        
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            {discount}% OFF
          </div>
        )}
        
        {/* Bottom overlay info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 text-white text-sm">
            <MapPin className="w-4 h-4" />
            <span>{tour.destination}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(tour.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-neutral-700">
            {tour.rating}
          </span>
          <span className="text-sm text-neutral-500">
            ({tour.reviewCount} reviews)
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {tour.title}
        </h3>

        {/* Tour details */}
        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{tour.groupSize}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <ul className="space-y-1">
            {tour.highlights.slice(0, 2).map((highlight, index) => (
              <li key={index} className="text-sm text-neutral-600 flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price and CTA - Redesigned */}
        <div className="pt-6 border-t border-neutral-200 space-y-4">
          {/* Price Section */}
          <div className="flex items-baseline justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatPrice(tour.price)}
                </span>
                {tour.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-500 line-through">
                      {formatPrice(tour.originalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {discount}% off
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-neutral-500">per person</p>
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                isLiked 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                  : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
            </button>
          </div>
          
          {/* CTA Button - Full Width */}
          <Link
            href={`/tours/${tour.slug}`}
            className="block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-center rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-[1.02]"
          >
            View Details & Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
