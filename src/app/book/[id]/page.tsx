'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react'
import { graphqlClient, TOUR_BY_SLUG_QUERY, TOUR_BY_ID_QUERY } from '@/lib/graphql-client'
import BookingForm from '@/components/BookingForm'
import BookingSuccess from '@/components/BookingSuccess'
import { BookingResult } from '@/hooks/useBooking'

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
  createdAt: string
  updatedAt: string
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  // State management
  const [tourData, setTourData] = useState<TourData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)

  // Fetch tour data
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const param = resolvedParams.id
        console.log('🔍 Fetching tour data for parameter:', param)
        
        // Detect if parameter is an ID (starts with 'cm' and is long) or a slug
        const isId = param.startsWith('cm') && param.length > 20
        
        let result: any
        let tour: TourData | undefined
        
        if (isId) {
          // Use direct tour query by ID
          console.log('📋 Using tour by ID query')
          result = await graphqlClient.request<{ tour: TourData | null }>(
            TOUR_BY_ID_QUERY, 
            { id: param }
          )
          tour = result.tour
        } else {
          // Use search tours query by slug
          console.log('🔍 Using tour by slug query')
          result = await graphqlClient.request<{ tourBySlug: TourData | null }>(
            TOUR_BY_SLUG_QUERY, 
            { slug: param }
          )
          tour = result.tourBySlug
        }
        
        console.log('📥 Received tour result:', result)
        
        if (tour) {
          setTourData(tour)
          console.log('✅ Found tour:', tour.title)
        } else {
          setError('Tour not found')
          console.log('❌ Tour not found for parameter:', param)
        }
      } catch (err: any) {
        console.error('❌ Error fetching tour data:', err)
        setError(err.message || 'Failed to load tour data')
      } finally {
        setLoading(false)
      }
    }

    fetchTourData()
  }, [resolvedParams.id])

  // Handle booking success
  const handleBookingSuccess = (booking: BookingResult) => {
    setBookingResult(booking)
  }

  // Handle new booking (reset to form)
  const handleNewBooking = () => {
    setBookingResult(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Loading Tour Details</h2>
          <p className="text-neutral-600">Please wait while we fetch the tour information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !tourData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Tour Not Found</h2>
          <p className="text-neutral-600 mb-6">
            {error || 'The tour you are looking for could not be found.'}
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/tours/${tourData.slug}`}
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tour Details
            </Link>
            
            {bookingResult && (
              <div className="text-sm text-neutral-600">
                Booking Reference: <span className="font-mono font-medium">{bookingResult.bookingReference}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tour Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                {tourData.title}
              </h1>
              <div className="flex items-center space-x-4 text-neutral-600 mb-4">
                <span className="flex items-center">
                  📍 {tourData.destination.name}, {tourData.destination.country.name}
                </span>
                <span className="flex items-center">
                  ⏱️ {tourData.duration} days
                </span>
                <span className="flex items-center">
                  ⭐ {tourData.rating} ({tourData.reviewCount} reviews)
                </span>
              </div>
              <p className="text-neutral-700 text-lg leading-relaxed">
                {tourData.description}
              </p>
            </div>
            
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
              <Image
                src={tourData.images[0] || '/api/placeholder/600/400'}
                alt={tourData.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {bookingResult ? (
          <BookingSuccess 
            booking={bookingResult} 
            onNewBooking={handleNewBooking}
          />
        ) : (
          <BookingForm 
            tour={tourData} 
            onBookingSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </div>
  )
}
