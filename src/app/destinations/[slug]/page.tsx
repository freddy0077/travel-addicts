'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Camera,
  Waves,
  Sun,
  Thermometer,
  Calendar,
  Activity,
  Heart,
  Share2,
  ChevronRight,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Navigation,
  Plane,
  Car,
  Train,
  Bus
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useDestination, transformDestinationForDetail } from '@/hooks/useDestination';
import { getDestinationHeroImage, getDestinationImageGallery } from '@/lib/destination-images';

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const { destination: apiDestination, loading, error, refetch } = useDestination(params.slug);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Transform API data for the page
  const destination = apiDestination ? transformDestinationForDetail(apiDestination) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading destination...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Destination Not Found</h1>
            <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist.</p>
            <Link
              href="/destinations"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Browse All Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities', icon: <Activity className="w-4 h-4" /> },
    { id: 'accommodation', label: 'Stay', icon: <MapPin className="w-4 h-4" /> },
    { id: 'transport', label: 'Getting There', icon: <Plane className="w-4 h-4" /> }
  ];

  const heroImage = getDestinationHeroImage(destination);
  const imageGallery = getDestinationImageGallery(destination);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src={heroImage.path}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-20">
          <nav className="flex items-center space-x-2 text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{destination.name}</span>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex space-x-3">
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end justify-start z-10">
          <div className="p-8 md:p-12 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Location Badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  {destination.country.name}, {destination.country.continent}
                </span>
              </div>
              
              {/* Destination Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {destination.name}
              </h1>
              
              {/* Hero Image Attribution */}
              <div className="flex items-center text-white/80 text-sm mb-6">
                <Camera className="w-4 h-4 mr-2" />
                <span>{heroImage.description}</span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Thermometer className="w-5 h-5 mr-2" />
                  <span className="font-medium">{destination.climate}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">{destination.bestTime}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">{destination.duration} days</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore {destination.name}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {activeImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveImageIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={imageGallery[activeImageIndex]?.path || ''}
                alt={imageGallery[activeImageIndex]?.description || ''}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                {imageGallery[activeImageIndex]?.destination}
              </h3>
              <p className="text-xs text-white/80">{imageGallery[activeImageIndex]?.description}</p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {imageGallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(activeImageIndex > 0 ? activeImageIndex - 1 : imageGallery.length - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(activeImageIndex < imageGallery.length - 1 ? activeImageIndex + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Description */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">About {destination.name}</h2>
                  <div className="prose prose-lg max-w-none text-gray-600">
                    {destination.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Visit {destination.name}?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Section */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-orange-500" />
                    African Landscapes & Experiences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageGallery.map((image: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -5 }}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image.path}
                          alt={image.description}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="font-semibold text-sm mb-1">{image.destination}</h4>
                          <p className="text-xs text-white/80">{image.description}</p>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Gallery Description */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold text-orange-600">Discover Africa's Beauty:</span> These stunning landscapes showcase the diverse beauty of African destinations, from pristine beaches and majestic mountains to vibrant wildlife and ancient cultural sites. Each image represents the authentic African experience waiting for you.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activities' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Things to Do</h2>
                  <div className="grid gap-4">
                    {destination.activities.map((activity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                          <Activity className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{activity}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Attractions */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Nearby Attractions</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {destination.nearbyAttractions.map((attraction: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-800">{attraction.name}</h4>
                          <span className="text-sm text-primary-600 font-medium">{attraction.distance}</span>
                        </div>
                        <p className="text-gray-600">{attraction.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'accommodation' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Where to Stay</h2>
                  <div className="space-y-6">
                    {destination.accommodation.map((hotel: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{hotel.name}</h3>
                            <p className="text-gray-600">{hotel.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{hotel.rating}</span>
                            </div>
                            <p className="text-lg font-bold text-primary-600">From ${hotel.priceFrom}</p>
                            <p className="text-sm text-gray-500">per night</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hotel.features.map((feature: string, featureIndex: number) => (
                            <span
                              key={featureIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transport' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Getting to {destination.name}</h2>
                  <div className="space-y-6">
                    {destination.transportation.map((transport: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            {transport.method.includes('Flight') && <Plane className="w-6 h-6 text-blue-600" />}
                            {transport.method.includes('Drive') && <Car className="w-6 h-6 text-blue-600" />}
                            {transport.method.includes('Bus') && <Bus className="w-6 h-6 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{transport.method}</h3>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary-600">{transport.cost}</p>
                                <p className="text-sm text-gray-500">{transport.duration}</p>
                              </div>
                            </div>
                            <p className="text-gray-600">{transport.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Tips */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Local Tips</h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                    <ul className="space-y-3">
                      {destination.localTips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Best Time</span>
                    <span className="font-medium">{destination.bestTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Climate</span>
                    <span className="font-medium">{destination.climate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-medium">{destination.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{destination.duration}</span>
                  </div>
                </div>
              </div>

              {/* Book Now */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Ready to Visit?</h3>
                <p className="text-primary-100 mb-4">Explore our curated tours to {destination.name}</p>
                <div className="space-y-3">
                  <Link
                    href={`/tours?destination=${destination.slug}`}
                    className="block w-full bg-white text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View Tours
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full border border-white/30 text-white text-center py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Custom Trip
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-600">+233 30 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-600">hello@traveladdicts.org</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
