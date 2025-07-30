'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, Grid, List, SlidersHorizontal, Search, Loader2 } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import TourCard from '@/components/ui/TourCard'
import TourCardSkeleton from '@/components/ui/TourCardSkeleton'
import AfricanHero from '@/components/ui/AfricanHero'
import { useSearchTours, useSearchFilters, SearchFilters } from '@/hooks/useSearch'
import { formatPrice } from '@/lib/currency'
import { cn } from '@/lib/utils'

function ToursPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity')
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    continent: searchParams.get('continent') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    duration: searchParams.get('duration') || undefined,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    features: searchParams.get('features')?.split(',') || undefined,
    season: searchParams.get('season') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    adults: searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : undefined,
    children: searchParams.get('children') ? parseInt(searchParams.get('children')!) : undefined
  })

  // Use search hooks
  const { tours, loading, error, totalCount, hasMore, searchTours } = useSearchTours()
  const { filters: searchFiltersData, loading: filtersLoading } = useSearchFilters()

  // Perform search when filters change
  useEffect(() => {
    const searchFilters = { ...filters }
    if (searchQuery) searchFilters.query = searchQuery
    
    searchTours(searchFilters, 12, 0)
  }, [filters, searchQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filters.continent && filters.continent !== 'All') params.set('continent', filters.continent)
    if (filters.category && filters.category !== 'All') params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.duration && filters.duration !== 'All') params.set('duration', filters.duration)
    if (filters.minRating) params.set('minRating', filters.minRating.toString())
    if (filters.features && filters.features.length > 0) params.set('features', filters.features.join(','))
    if (filters.season && filters.season !== 'All') params.set('season', filters.season)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    if (filters.adults) params.set('adults', filters.adults.toString())
    if (filters.children) params.set('children', filters.children.toString())
    if (sortBy !== 'popularity') params.set('sort', sortBy)
    
    const newUrl = params.toString() ? `/tours?${params.toString()}` : '/tours'
    router.replace(newUrl, { scroll: false })
  }, [filters, searchQuery, sortBy, router])

  const handleSearch = (searchData: any) => {
    setSearchQuery(searchData.destination || searchData.query || '')
    
    const newFilters: SearchFilters = { ...filters }
    
    if (searchData.continent && searchData.continent !== 'All') {
      newFilters.continent = searchData.continent
    }
    
    if (searchData.category && searchData.category !== 'All') {
      newFilters.category = searchData.category
    }
    
    if (searchData.minPrice || searchData.maxPrice) {
      const min = parseInt(searchData.minPrice) || 0
      const max = parseInt(searchData.maxPrice) || 10000
      
      newFilters.minPrice = min // Already in USD
      newFilters.maxPrice = max // Already in USD
    }
    
    if (searchData.duration && searchData.duration !== 'All') {
      newFilters.duration = searchData.duration
    }
    
    if (searchData.minRating) {
      newFilters.minRating = parseFloat(searchData.minRating)
    }
    
    if (searchData.features && searchData.features.length > 0) {
      newFilters.features = searchData.features
    }
    
    if (searchData.season && searchData.season !== 'All') {
      newFilters.season = searchData.season
    }
    
    if (searchData.startDate) {
      newFilters.startDate = searchData.startDate
    }
    
    if (searchData.endDate) {
      newFilters.endDate = searchData.endDate
    }
    
    if (searchData.adults) {
      newFilters.adults = parseInt(searchData.adults)
    }
    
    if (searchData.children) {
      newFilters.children = parseInt(searchData.children)
    }
    
    setFilters(newFilters)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterType]: value === 'All' ? undefined : value 
    }))
  }

  const loadMoreTours = () => {
    if (hasMore && !loading) {
      const searchFilters = { ...filters }
      if (searchQuery) searchFilters.query = searchQuery
      
      searchTours(searchFilters, 12, tours.length)
    }
  }

  // Transform tours data for TourCard component
  const transformedTours = tours.map(tour => ({
    id: tour.id,
    title: tour.title,
    destination: tour.destination.name,
    image: tour.images[0] || '/api/placeholder/400/300',
    price: tour.priceFrom, // Already in USD
    duration: tour.duration,
    // groupSize: `Max ${tour.groupSizeMax}`,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    highlights: tour.highlights.slice(0, 3),
    slug: tour.slug,
    featured: tour.featured,
    category: tour.category,
    continent: tour.destination.country.continent
  }))

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* African Hero Section */}
      <AfricanHero
        title="African Safari Tours"
        subtitle="Discover Africa's incredible wildlife, stunning landscapes, and rich cultures through expertly guided adventures"
        height="md"
        images={[
          '/images/destinations/serengeti-migration.jpg',
          '/images/destinations/masai-mara-balloon.jpg',
          '/images/destinations/kruger-national-park.jpg'
        ]}
      >
        <div className="mt-8 mb-12">
          <SearchBar 
            variant="hero" 
            className="max-w-4xl mx-auto" 
            onSearch={handleSearch} 
          />
        </div>
      </AfricanHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            'lg:w-80 space-y-6',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Tours
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Options */}
              {searchFiltersData && Object.entries({
                continent: ['All', ...(searchFiltersData.continents || [])],
                category: ['All', ...(searchFiltersData.tourCategories || [])],
                duration: ['All', ...(searchFiltersData.durationOptions || [])],
                season: ['All', ...(searchFiltersData.seasons || [])]
              }).map(([filterType, options]) => (
                <div key={filterType} className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2 capitalize">
                    {filterType === 'priceRange' ? 'Price Range' : filterType}
                  </label>
                  <select
                    value={filters[filterType as keyof SearchFilters] || 'All'}
                    onChange={(e) => handleFilterChange(filterType, e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Price Range Filter */}
              {searchFiltersData?.priceRanges && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={
                      filters.minPrice && filters.maxPrice 
                        ? searchFiltersData.priceRanges.find(range => 
                            range.min <= filters.minPrice! && 
                            range.max >= filters.maxPrice!
                          )?.label || 'All'
                        : 'All'
                    }
                    onChange={(e) => {
                      if (e.target.value === 'All') {
                        setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))
                      } else {
                        const range = searchFiltersData.priceRanges.find(r => r.label === e.target.value)
                        if (range) {
                          setFilters(prev => ({ 
                            ...prev, 
                            minPrice: range.min, 
                            maxPrice: range.max 
                          }))
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="All">All Prices</option>
                    {searchFiltersData.priceRanges.map(range => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({
                    query: '',
                    continent: undefined,
                    category: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    duration: undefined,
                    minRating: undefined,
                    features: undefined,
                    season: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    adults: undefined,
                    children: undefined
                  })
                  setSearchQuery('')
                }}
                className="w-full px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <p className="text-neutral-600">
                  {transformedTours.length} tours found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[
                    { value: 'popularity', label: 'Most Popular' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'duration', label: 'Duration' }
                  ].map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tours Grid/List */}
            {loading ? (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                  : 'space-y-6'
              )}>
                {[1, 2, 3, 4, 5, 6].map(index => (
                  <TourCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error loading tours</h3>
                <p className="text-neutral-600 mb-4">
                  Please try again later.
                </p>
              </div>
            ) : transformedTours.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No tours found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your filters or search terms to find more tours.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      query: '',
                      continent: undefined,
                      category: undefined,
                      minPrice: undefined,
                      maxPrice: undefined,
                      duration: undefined,
                      minRating: undefined,
                      features: undefined,
                      season: undefined,
                      startDate: undefined,
                      endDate: undefined,
                      adults: undefined,
                      children: undefined
                    })
                    setSearchQuery('')
                  }}
                  className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                  : 'space-y-6'
              )}>
                {transformedTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {transformedTours.length > 0 && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreTours}
                  className="px-8 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Load More Tours
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  return (
    <Suspense fallback={<Loader2 className="w-8 h-8 text-neutral-400 mx-auto" />}>
      <ToursPageContent />
    </Suspense>
  )
}
