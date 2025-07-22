'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Camera,
  Mountain,
  Waves,
  Building,
  TreePine,
  Sun,
  Snowflake,
  Compass,
  Heart,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useDestinations, transformDestinationForPage } from '@/hooks/useDestinations';
import { DestinationsPageSkeletonGrid } from '@/components/ui/DestinationPageSkeleton';
import { useFeaturedTours } from '@/hooks/useFeaturedTours';

const continents = ['All', 'Europe', 'Asia', 'Africa', 'South America', 'North America', 'Oceania'];
const types = ['All', 'Mountains', 'Islands', 'Cultural', 'Safari', 'Adventure', 'Tropical', 'Countryside'];
const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter', 'All Year'];

const getTypeIcon = (type: string) => {
  const iconProps = "w-5 h-5 text-primary-600";
  
  switch (type) {
    case 'Mountains': return <Mountain className={iconProps} />;
    case 'Islands': return <Waves className={iconProps} />;
    case 'Cultural': return <Building className={iconProps} />;
    case 'Safari': return <TreePine className={iconProps} />;
    case 'Adventure': return <Compass className={iconProps} />;
    case 'Tropical': return <Sun className={iconProps} />;
    case 'Countryside': return <TreePine className={iconProps} />;
    case 'City': return <Building className={iconProps} />;
    case 'Historical': return <Building className={iconProps} />;
    default: return <MapPin className={iconProps} />;
  }
};

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // API integration
  const { destinations: apiDestinations, loading, error, refetch } = useDestinations();
  const { tours: featuredTours, loading: toursLoading } = useFeaturedTours(5);
  
  const destinations = useMemo(() => 
    apiDestinations.map(transformDestinationForPage), 
    [apiDestinations]
  );

  // Get hero images from featured tours
  const heroImages = useMemo(() => {
    // Use our beautiful African destination images
    return [
      '/images/destinations/serengeti-migration.jpg',
      '/images/destinations/kilimanjaro-sunrise.jpg',
      '/images/destinations/victoria-falls.jpg',
      '/images/destinations/zanzibar-beach.jpg',
      '/images/destinations/cape-town-table-mountain.jpg'
    ];
  }, []);

  // Auto-rotate hero images every 5 seconds
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesContinent = selectedContinent === 'All' || destination.continent === selectedContinent;
    const matchesType = selectedType === 'All' || destination.type === selectedType;
    const matchesSeason = selectedSeason === 'All' || destination.season.includes(selectedSeason);
    
    return matchesSearch && matchesContinent && matchesType && matchesSeason;
  });

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price': return a.priceFrom - b.priceFrom;
      case 'rating': return b.rating - a.rating;
      default: return b.featured ? 1 : -1;
    }
  });

  const featuredDestinations = sortedDestinations.filter(dest => dest.featured);
  const regularDestinations = sortedDestinations.filter(dest => !dest.featured);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Discover Amazing Destinations
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              >
                Explore breathtaking locations and create unforgettable memories
              </motion.p>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-lg text-gray-600">Loading destinations...</span>
          </div>
          <DestinationsPageSkeletonGrid />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Discover Amazing Destinations
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading destinations</h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImages[currentHeroImage]}
            alt="Featured Destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Image Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentHeroImage
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Discover Africa's Wonders
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              From the Serengeti's great migration to Victoria Falls' thundering waters - explore Africa's most breathtaking destinations
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <MapPin className="w-5 h-5" />
              <span>{destinations.length}+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Star className="w-5 h-5" />
              <span>4.8 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Users className="w-5 h-5" />
              <span>50K+ Happy Travelers</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors lg:hidden"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="featured">Featured First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price Low-High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className={cn(
            "transition-all duration-300",
            showFilters || "hidden lg:block"
          )}>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
                <select
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {continents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="space-y-12">
          {/* Featured Destinations */}
          {featuredDestinations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Destinations</h2>
                  <p className="text-gray-600 mt-1">Our most popular and highly-rated destinations</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>Premium Selection</span>
                </div>
              </div>
              
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
              )}>
                {featuredDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300",
                      viewMode === 'list' && "flex"
                    )}
                  >
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden",
                      viewMode === 'grid' ? "h-64" : "w-80 h-48 flex-shrink-0"
                    )}>
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {destination.country}
                          </p>
                        </div>
                        <div className="text-right">
                          {getTypeIcon(destination.type)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({destination.reviewCount})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {destination.tourCount} tours
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {destination.duration}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Highlights</p>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {highlight}
                            </span>
                          ))}
                          {destination.highlights.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{destination.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-lg font-bold text-gray-900">
                            GH₵{formatPrice(destination.priceFrom)}
                          </p>
                        </div>
                        <Link
                          href={`/destinations/${destination.slug}`}
                          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Explore
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Destinations */}
          {regularDestinations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Destinations</h2>
                  <p className="text-gray-600 mt-1">Discover amazing places around the world</p>
                </div>
                <div className="text-sm text-gray-500">
                  {regularDestinations.length} destination{regularDestinations.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
              )}>
                {regularDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (featuredDestinations.length + index) * 0.1 }}
                    className={cn(
                      "relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300",
                      viewMode === 'list' && "flex"
                    )}
                  >
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden",
                      viewMode === 'grid' ? "h-64" : "w-80 h-48 flex-shrink-0"
                    )}>
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {destination.country}
                          </p>
                        </div>
                        <div className="text-right">
                          {getTypeIcon(destination.type)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({destination.reviewCount})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {destination.tourCount} tours
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {destination.duration}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Highlights</p>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {highlight}
                            </span>
                          ))}
                          {destination.highlights.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{destination.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-lg font-bold text-gray-900">
                            GH₵{formatPrice(destination.priceFrom)}
                          </p>
                        </div>
                        <Link
                          href={`/destinations/${destination.slug}`}
                          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Explore
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse our featured destinations.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedContinent('All');
                  setSelectedType('All');
                  setSelectedSeason('All');
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Can't Find Your Dream Destination?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our travel experts can create a custom itinerary for any destination in the world. 
            Let us help you plan your perfect adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Plan Custom Trip
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Browse All Tours
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
