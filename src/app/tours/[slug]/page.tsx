'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, Clock, Users, MapPin, Calendar, Heart, Share2, 
  Check, X, ChevronLeft, ChevronRight, Play, Award,
  Wifi, Car, Utensils, Bed, Shield, Camera, Minus, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { graphqlClient, TOUR_BY_SLUG_QUERY, TOUR_PRICING_QUERY } from '@/lib/graphql-client'
import { formatPrice } from '@/lib/currency'

interface TourData {
  id: string
  title: string
  slug: string
  destination: {
    id: string
    name: string
    country: {
      id: string
      name: string
      code: string
      continent: string
    }
  }
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  duration: number
  groupSizeMax: number
  difficulty: string
  priceFrom: number
  images: string[]
  featured: boolean
  category: string
  features: string[]
  season: string
  rating: number
  reviewCount: number
  itinerary: Array<{
    id: string
    dayNumber: number
    title: string
    description: string
    activities: string[]
    meals: string[]
    accommodation: string | null
  }>
  reviews: Array<{
    id: string
    rating: number
    title: string
    content: string
    user: {
      name: string
    } | null
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

interface TourPricing {
  id: string
  season: string
  priceAdult: number
  priceChild: number
  availableDates: string[]
  maxCapacity: number
}

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [tourData, setTourData] = useState<TourData | null>(null)
  const [pricingData, setPricingData] = useState<TourPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching tour data for slug:', resolvedParams.slug)
        
        const result = await graphqlClient.request<{
          tourBySlug: TourData | null
        }>(TOUR_BY_SLUG_QUERY, { slug: resolvedParams.slug })
        
        console.log('📥 Received tour result:', result)
        
        // Get the tour directly from tourBySlug
        const tour = result.tourBySlug
        
        if (tour) {
          setTourData(tour)
          console.log('✅ Found tour:', tour.title)
          
          // Fetch pricing data for this tour
          try {
            const pricingResult = await graphqlClient.request<{
              tourPricing: TourPricing[]
            }>(TOUR_PRICING_QUERY, { tourId: tour.id })
            
            console.log('📥 Received pricing result:', pricingResult)
            setPricingData(pricingResult.tourPricing || [])
            
            // Set default season if pricing data exists
            if (pricingResult.tourPricing && pricingResult.tourPricing.length > 0) {
              setSelectedSeason(pricingResult.tourPricing[0].season)
            }
          } catch (pricingError) {
            console.error('❌ Error fetching pricing data:', pricingError)
            // Don't fail the whole page if pricing fails
          }
        } else {
          setError('Tour not found')
          console.log('❌ Tour not found for slug:', resolvedParams.slug)
        }
      } catch (err: any) {
        console.error('❌ Error fetching tour data:', err)
        setError(err.message || 'Failed to load tour data')
      } finally {
        setLoading(false)
      }
    }

    fetchTourData()
  }, [resolvedParams.slug])

  // Helper functions for dynamic pricing
  const getCurrentPricing = () => {
    return pricingData.find(p => p.season === selectedSeason) || pricingData[0]
  }

  const getAvailableDates = () => {
    const currentPricing = getCurrentPricing()
    return currentPricing?.availableDates || []
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr // Return original string if parsing fails
    }
  }

  const getDateStatus = (dateStr: string) => {
    // For now, assume all dates are available
    // In the future, this could check against actual bookings
    return 'Available'
  }

  const calculateTotalPrice = () => {
    const currentPricing = getCurrentPricing()
    if (!currentPricing) return 0
    
    const adultPrice = currentPricing.priceAdult * adults
    const childPrice = currentPricing.priceChild * children
    return adultPrice + childPrice
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading tour details...</p>
        </div>
      </div>
    )
  }

  if (error || !tourData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Tour Not Found</h1>
          <p className="text-neutral-600 mb-4">{error || 'The requested tour could not be found.'}</p>
          <Link 
            href="/tours" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Tours
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = calculateTotalPrice()

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'dates', label: 'Dates & Pricing' },
    { id: 'reviews', label: 'Reviews' }
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === tourData.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? tourData.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="relative h-full">
          <Image
            src={tourData.images[currentImageIndex] || '/api/placeholder/800/600'}
            alt={tourData.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Image Navigation */}
          {tourData.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {tourData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{tourData.destination.name}, {tourData.destination.country.name}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
                {tourData.title}
              </h1>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tourData.duration} Days</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Max {tourData.groupSizeMax}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tourData.rating}</span>
                  </div>
                  <span className="text-white/80">({tourData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="border-b border-neutral-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">About This Tour</h3>
                      <p className="text-neutral-700 leading-relaxed">{tourData.description}</p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Tour Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tourData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Star className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                            <span className="text-neutral-700 text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Included/Not Included */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">What's Included</h3>
                        <div className="space-y-2">
                          {tourData.inclusions.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-neutral-700 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">What's Not Included</h3>
                        <div className="space-y-2">
                          {tourData.exclusions.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                              <span className="text-neutral-700 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Tour Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {tourData.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                            <Award className="w-5 h-5 text-primary-600" />
                            <span className="text-sm font-medium text-neutral-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'itinerary' && (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-neutral-900 mb-6">Day-by-Day Itinerary</h3>
                  
                  {tourData.itinerary && tourData.itinerary.length > 0 ? (
                    <div className="space-y-6">
                      {tourData.itinerary
                        .sort((a, b) => a.dayNumber - b.dayNumber)
                        .map((day, index) => (
                        <div key={day.id} className="relative">
                          {/* Timeline connector */}
                          {index < tourData.itinerary.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-full bg-primary-200 -z-10"></div>
                          )}
                          
                          <div className="flex items-start space-x-4">
                            {/* Day number circle */}
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {day.dayNumber}
                            </div>
                            
                            {/* Day content */}
                            <div className="flex-1 bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                              <div className="mb-4">
                                <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                                  {day.title}
                                </h4>
                                <p className="text-neutral-700 leading-relaxed">
                                  {day.description}
                                </p>
                              </div>
                              
                              {/* Activities */}
                              {day.activities && day.activities.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="font-medium text-neutral-900 mb-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                                    Activities
                                  </h5>
                                  <ul className="space-y-1">
                                    {day.activities.map((activity, actIndex) => (
                                      <li key={actIndex} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-neutral-700">{activity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Meals */}
                                {day.meals && day.meals.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-neutral-900 mb-2 flex items-center">
                                      <Utensils className="w-4 h-4 mr-2 text-green-600" />
                                      Meals Included
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {day.meals.map((meal, mealIndex) => (
                                        <span 
                                          key={mealIndex}
                                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"
                                        >
                                          {meal}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Accommodation */}
                                {day.accommodation && (
                                  <div>
                                    <h5 className="font-medium text-neutral-900 mb-2 flex items-center">
                                      <Bed className="w-4 h-4 mr-2 text-blue-600" />
                                      Accommodation
                                    </h5>
                                    <p className="text-sm text-neutral-700 bg-blue-50 px-3 py-2 rounded-lg">
                                      {day.accommodation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">No detailed itinerary available for this tour.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'dates' && (
                <motion.div
                  key="dates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Available Dates & Pricing</h3>
                      <p className="text-neutral-600">Choose your preferred departure date and see pricing details</p>
                    </div>

                    {/* Pricing Overview */}
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary-600 mb-1">
                            {formatPrice(tourData.priceFrom)}
                          </div>
                          <div className="text-sm text-neutral-600">Starting from per person</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-neutral-900 mb-1">1 Day</div>
                          <div className="text-sm text-neutral-600">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-neutral-900 mb-1">Max {tourData.groupSizeMax}</div>
                          <div className="text-sm text-neutral-600">Group Size</div>
                        </div>
                      </div>
                    </div>

                    {/* Available Dates */}
                    <div>
                      <h4 className="text-xl font-semibold text-neutral-900 mb-4">Available Departure Dates</h4>
                      <div className="grid gap-4">
                        {pricingData.length > 0 ? (
                          pricingData.map((pricing) => (
                            <div key={pricing.id} className="border border-neutral-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h5 className="font-semibold text-neutral-900">{pricing.season} Season</h5>
                                  <p className="text-sm text-neutral-600">
                                    {pricing.season === 'Peak' && 'High demand period with premium pricing'}
                                    {pricing.season === 'High' && 'Popular travel season with increased rates'}
                                    {pricing.season === 'Low' && 'Great value season with lower rates'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-neutral-900">
                                    {formatPrice(pricing.priceAdult)}
                                  </div>
                                  <div className="text-sm text-neutral-600">per adult</div>
                                  {pricing.priceChild > 0 && (
                                    <div className="text-sm text-neutral-500">
                                      {formatPrice(pricing.priceChild)} child
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {pricing.availableDates.map((date) => (
                                  <button
                                    key={date}
                                    onClick={() => {
                                      setSelectedDate(date)
                                      setSelectedSeason(pricing.season)
                                    }}
                                    className={cn(
                                      'p-3 rounded-lg border text-center transition-colors',
                                      selectedDate === date
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                                    )}
                                  >
                                    <div className="font-medium">{formatDate(date)}</div>
                                    <div className="text-xs text-green-600">{getDateStatus(date)}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="border border-neutral-200 rounded-xl p-6 text-center">
                            <p className="text-neutral-600">No available dates found. Please contact us for more information.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">Pricing Details</h4>
                      <div className="space-y-4">
                        {/* Adult Pricing */}
                        <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                          <div>
                            <span className="font-medium text-neutral-900">Adult (18+ years)</span>
                            <p className="text-sm text-neutral-600">Full tour experience</p>
                          </div>
                          <span className="font-semibold text-neutral-900">
                            {formatPrice(tourData.priceFrom)}
                          </span>
                        </div>

                        {/* Child Pricing */}
                        <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                          <div>
                            <span className="font-medium text-neutral-900">Child (5-17 years)</span>
                            <p className="text-sm text-neutral-600">50% discount on adult price</p>
                          </div>
                          <span className="font-semibold text-neutral-900">
                            {formatPrice(tourData.priceFrom * 0.5)}
                          </span>
                        </div>

                        {/* Infant Pricing */}
                        <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                          <div>
                            <span className="font-medium text-neutral-900">Infant (0-4 years)</span>
                            <p className="text-sm text-neutral-600">Free with paying adult</p>
                          </div>
                          <span className="font-semibold text-green-600">Free</span>
                        </div>
                      </div>
                    </div>

                    {/* Group Discounts */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        Group Discounts
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">5%</div>
                          <div className="text-sm text-neutral-600">Groups of 6-10</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">10%</div>
                          <div className="text-sm text-neutral-600">Groups of 11-15</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">15%</div>
                          <div className="text-sm text-neutral-600">Groups of 16+</div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mt-4 text-center">
                        Contact us for custom group pricing and private tour options
                      </p>
                    </div>

                    {/* What's Included */}
                    <div className="border border-neutral-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">What's Included in the Price</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {tourData.inclusions.slice(0, Math.ceil(tourData.inclusions.length / 2)).map((inclusion, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-neutral-700">{inclusion}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {tourData.inclusions.slice(Math.ceil(tourData.inclusions.length / 2)).map((inclusion, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-neutral-700">{inclusion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Not Included */}
                    {tourData.exclusions.length > 0 && (
                      <div className="border border-red-200 rounded-xl p-6 bg-red-50">
                        <h4 className="text-lg font-semibold text-neutral-900 mb-4">Not Included</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            {tourData.exclusions.slice(0, Math.ceil(tourData.exclusions.length / 2)).map((exclusion, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-700">{exclusion}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-3">
                            {tourData.exclusions.slice(Math.ceil(tourData.exclusions.length / 2)).map((exclusion, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-700">{exclusion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Information */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">Booking Information</h4>
                      <div className="space-y-3 text-sm text-neutral-700">
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Free Cancellation:</span> Cancel up to 24 hours before departure for a full refund
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Instant Confirmation:</span> Receive confirmation immediately after booking
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Small Groups:</span> Maximum {tourData.groupSizeMax} participants for personalized experience
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white text-center"
                      >
                        <h4 className="text-xl font-semibold mb-2">Ready to Book {selectedDate}?</h4>
                        <p className="mb-4 opacity-90">Secure your spot on this unforgettable journey</p>
                        <Link
                          href={`/book/${tourData.id}?date=${selectedDate}`}
                          className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                          Book Now - {selectedDate}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-neutral-900">{tourData.rating}</span>
                      <span className="text-neutral-600">({tourData.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {tourData.reviews.length > 0 ? (
                      tourData.reviews.map((review) => (
                        <div key={review.id} className="border border-neutral-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-neutral-900">
                                {review.user?.name || 'Anonymous User'}
                              </h4>
                              <p className="text-sm text-neutral-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "w-4 h-4",
                                    i < review.rating 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-neutral-300"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                          <h5 className="font-medium text-neutral-900 mb-2">{review.title}</h5>
                          <p className="text-neutral-700">{review.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Star className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                        <p className="text-neutral-600">No reviews yet. Be the first to review this tour!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-large p-6 border border-neutral-200">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-neutral-900">
                    {formatPrice(tourData.priceFrom)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">per person</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map((date) => (
                      <option key={date} value={date}>{formatDate(date)}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Adults
                    </label>
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center py-2 font-medium">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Children
                    </label>
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center py-2 font-medium">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-600">Adults ({adults} × {formatPrice(tourData.priceFrom)})</span>
                  <span className="font-medium">{formatPrice(tourData.priceFrom * adults)}</span>
                </div>
                {children > 0 && (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-neutral-600">Children ({children} × {formatPrice(tourData.priceFrom * 0.5)})</span>
                    <span className="font-medium">{formatPrice(tourData.priceFrom * 0.5 * children)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/book/${tourData.id}`}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                >
                  Book Now
                </Link>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    'w-full border-2 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2',
                    isLiked
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                  )}
                >
                  <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  <span>{isLiked ? 'Saved' : 'Save for Later'}</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Free Cancellation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
