'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Play, Star, Award, Users, Globe, Shield, ArrowRight, Quote } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import TourCard from '@/components/ui/TourCard'
import TourCardSkeleton from '@/components/ui/TourCardSkeleton'
import DestinationCardSkeleton, { DestinationsSkeletonGrid } from '@/components/ui/DestinationCardSkeleton'
import { useFeaturedTours } from '@/hooks/useFeaturedTours'
import { usePopularDestinations } from '@/hooks/usePopularDestinations'
import { transformFeaturedToursForHome } from '@/utils/tourTransformers'
import { getFeaturedDestinationsForHome, fallbackDestinations } from '@/utils/destinationTransformers'
import { SearchFilters } from '@/hooks/useSearch'
import { useTestimonials } from '@/hooks/useTestimonials'

const whyChooseUs = [
  {
    icon: Award,
    title: 'Award-Winning Service',
    description: 'Recognized globally for excellence in luxury travel experiences'
  },
  {
    icon: Users,
    title: 'Expert Local Guides',
    description: 'Passionate locals who bring destinations to life with insider knowledge'
  },
  {
    icon: Globe,
    title: 'Sustainable Travel',
    description: 'Committed to responsible tourism that benefits local communities'
  },
  {
    icon: Shield,
    title: 'Peace of Mind',
    description: '24/7 support and comprehensive travel protection for worry-free adventures'
  }
]

export default function Home() {
  const router = useRouter()
  const { tours: featuredToursData, loading: toursLoading, error: toursError, refetch } = useFeaturedTours(3)
  const { destinations: popularDestinationsData, loading: destinationsLoading, error: destinationsError } = usePopularDestinations()
  const { testimonials: testimonialsData, loading: testimonialsLoading, error: testimonialsError } = useTestimonials()
  
  // Transform API data to match home page format
  const featuredTours = transformFeaturedToursForHome(featuredToursData)
  const popularDestinations = getFeaturedDestinationsForHome(popularDestinationsData)

  // Debug logging
  console.log('Raw destinations data:', popularDestinationsData)
  console.log('Transformed destinations:', popularDestinations)
  console.log('Destinations loading:', destinationsLoading)
  console.log('Destinations error:', destinationsError)

  const handleSearch = (searchData: SearchFilters) => {
    // Build search parameters
    const params = new URLSearchParams()
    
    // Handle text query (destination search)
    if (searchData.query) {
      params.set('q', searchData.query)
    }
    
    // Handle geographic filters
    if (searchData.continent) {
      params.set('continent', searchData.continent)
    }
    
    if (searchData.country) {
      params.set('country', searchData.country)
    }
    
    if (searchData.destination) {
      params.set('destination', searchData.destination)
    }
    
    // Handle category
    if (searchData.category) {
      params.set('category', searchData.category)
    }
    
    // Handle price range
    if (searchData.minPrice || searchData.maxPrice) {
      if (searchData.minPrice) params.set('minPrice', (searchData.minPrice / 100).toString())
      if (searchData.maxPrice) params.set('maxPrice', (searchData.maxPrice / 100).toString())
    }
    
    // Handle duration
    if (searchData.duration) {
      params.set('duration', searchData.duration)
    }
    
    // Handle rating
    if (searchData.minRating) {
      params.set('minRating', searchData.minRating.toString())
    }
    
    // Handle features
    if (searchData.features && searchData.features.length > 0) {
      params.set('features', searchData.features.join(','))
    }
    
    // Handle season
    if (searchData.season) {
      params.set('season', searchData.season)
    }
    
    // Handle dates
    if (searchData.startDate) {
      params.set('startDate', searchData.startDate)
    }
    
    if (searchData.endDate) {
      params.set('endDate', searchData.endDate)
    }
    
    // Handle travelers
    if (searchData.adults) {
      params.set('adults', searchData.adults.toString())
    }
    
    if (searchData.children) {
      params.set('children', searchData.children.toString())
    }
    
    // Navigate to tours page with search parameters
    router.push(`/tours?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/destinations/serengeti-migration.jpg"
            alt="Wildebeest migration in Serengeti National Park - Experience Africa's greatest wildlife spectacle"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Travel Addicts <br />
              <br />
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Hidden Treasures
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Embark on extraordinary African adventures crafted by local experts.
              Experience authentic culture, breathtaking wildlife, and unforgettable moments across the continent.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/tours"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-large hover:shadow-glow"
              >
                Explore Tours
              </Link>
              {/*<button className="flex items-center space-x-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-colors">*/}
              {/*  <Play className="w-5 h-5" />*/}
              {/*  <span>Watch Video</span>*/}
              {/*</button>*/}
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16"
          >
            <SearchBar className="max-w-4xl mx-auto" onSearch={handleSearch} />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
              Featured Tours
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Handpicked experiences that showcase the very best of each destination, 
              curated by our travel experts.
            </p>
          </motion.div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <TourCardSkeleton key={i} />
              ))}
            </div>
          ) : toursError ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Error loading featured tours.</h2>
              <button
                onClick={refetch}
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-large hover:shadow-glow"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-medium hover:shadow-large"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
              Why Travel With Us
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We're not just another travel company. We're your partners in creating 
              life-changing experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
              Popular Destinations
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From ancient wonders to modern marvels, explore the world's most 
              captivating destinations.
            </p>
          </motion.div>

          {destinationsLoading ? (
            <DestinationsSkeletonGrid />
          ) : destinationsError ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Error loading popular destinations.</h2>
              <p className="text-red-600 mb-4">Error: {destinationsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-large hover:shadow-glow"
              >
                Try Again
              </button>
            </div>
          ) : popularDestinations.length === 0 ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">No destinations found</h2>
              <p className="text-gray-600 mb-4">Loading destinations from API...</p>
            </div>
          ) : (
            <div>
              {/* Debug info */}
              {/*<div className="mb-4 p-4 bg-yellow-100 rounded-lg">*/}
              {/*  <p className="text-sm text-gray-800">*/}
              {/*    Debug: Found {popularDestinations.length} destinations: {popularDestinations.map(d => d.name).join(', ')}*/}
              {/*  </p>*/}
              {/*</div>*/}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 min-h-[200px]">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">{destination.name}</h3>
                        <p className="text-sm opacity-90">{destination.tours} tours</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from travelers who've experienced 
              the magic firsthand.
            </p>
          </motion.div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="animate-pulse bg-gray-200 h-4 w-4/5 mb-4" />
                  <div className="animate-pulse bg-gray-200 h-4 w-3/5 mb-4" />
                  <div className="animate-pulse bg-gray-200 h-4 w-2/5 mb-4" />
                </div>
              ))}
            </div>
          ) : testimonialsError ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Error loading testimonials.</h2>
              <p className="text-red-600 mb-4">Error: {testimonialsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-large hover:shadow-glow"
              >
                Try Again
              </button>
            </div>
          ) : testimonialsData.length === 0 ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">No testimonials found</h2>
              <p className="text-gray-600 mb-4">Loading testimonials from API...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialsData.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <Quote className="w-8 h-8 text-primary-600 mb-4" />
                  <p className="text-neutral-700 mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {testimonial.location}
                      </p>
                    </div>
                    {/* <div className="flex ml-auto">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Let our travel experts craft the perfect journey for you. 
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-large"
              >
                Start Planning
              </Link>
              <Link
                href="/tours"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Tours
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
