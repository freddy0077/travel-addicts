'use client';

import { useState, useEffect } from 'react';
import { graphqlClient, FEATURED_TOURS_QUERY, SEARCH_DESTINATIONS_QUERY, SEARCH_FILTERS_QUERY, SEARCH_TOURS_QUERY } from '@/lib/graphql-client';

// Search interfaces
export interface SearchFilters {
  query?: string;
  continent?: string;
  country?: string;
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  minRating?: number;
  features?: string[];
  season?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  adults?: number;
  children?: number;
}

export interface SearchTour {
  id: string;
  title: string;
  slug: string;
  destination: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      code: string;
      continent: string;
    };
  };
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  duration: number;
  groupSizeMax: number;
  difficulty: string;
  priceFrom: number;
  images: string[];
  featured: boolean;
  category: string;
  features: string[];
  season: string;
  rating: number;
  reviewCount: number;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    customer: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  bestTime: string;
}

export interface SearchDestination {
  id: string;
  name: string;
  slug: string;
  country: {
    id: string;
    name: string;
    code: string;
    continent: string;
  };
  type: string;
  season: string;
  description: string;
  highlights: string[];
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  duration: string;
  bestTime: string;
  climate: string;
  activities: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
}

export interface SearchFiltersData {
  continents: string[];
  countries: Array<{
    id: string;
    name: string;
    code: string;
    continent: string;
  }>;
  tourCategories: string[];
  tourFeatures: string[];
  destinationTypes: string[];
  seasons: string[];
  priceRanges: Array<{
    min: number;
    max: number;
    label: string;
  }>;
  durationOptions: string[];
}

// Hook for searching tours
export function useSearchTours() {
  const [tours, setTours] = useState<SearchTour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const searchTours = async (filters: SearchFilters, limit: number = 12, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Searching tours with filters:', filters);

      const variables = {
        ...filters,
        limit,
        offset
      };

      console.log('📤 Sending search variables:', variables);

      const result = await graphqlClient.request<{
        searchTours: {
          tours: SearchTour[];
          totalCount: number;
          hasMore: boolean;
        };
      }>(SEARCH_TOURS_QUERY, variables);

      console.log('📥 Received search result:', result);

      const searchData = result.searchTours;
      
      if (offset === 0) {
        // New search - replace results
        setTours(searchData.tours);
      } else {
        // Load more - append results
        setTours(prev => [...prev, ...searchData.tours]);
      }
      
      setTotalCount(searchData.totalCount);
      setHasMore(searchData.hasMore);

      console.log('✅ Tours search completed:', {
        toursCount: searchData.tours.length,
        totalCount: searchData.totalCount,
        hasMore: searchData.hasMore
      });

    } catch (err: any) {
      console.error('❌ Error searching tours:', err);
      setError(err.message || 'Failed to search tours');
      
      // Fallback to mock data for development
      const mockTours: SearchTour[] = [
        {
          id: '1',
          title: 'Amazing Safari Adventure',
          slug: 'amazing-safari-adventure',
          destination: {
            id: '1',
            name: 'Serengeti',
            country: {
              id: '1',
              name: 'Tanzania',
              code: 'TZ',
              continent: 'Africa'
            }
          },
          description: 'Experience the wild beauty of Africa',
          highlights: ['Big Five', 'Migration', 'Camping'],
          inclusions: ['Meals', 'Transport', 'Guide'],
          exclusions: ['Flights', 'Insurance'],
          duration: 7, // Changed to number
          groupSizeMax: 12,
          difficulty: 'Moderate',
          priceFrom: 250000, // 2500 GHS in pesewas
          images: ['/api/placeholder/600/400'],
          featured: true,
          category: 'Adventure',
          features: ['Wildlife', 'Photography'],
          season: 'Dry Season',
          rating: 4.8,
          reviewCount: 45,
          reviews: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          bestTime: 'June to October'
        }
      ];
      
      setTours(mockTours);
      setTotalCount(1);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    tours,
    loading,
    error,
    totalCount,
    hasMore,
    searchTours
  };
}

// Hook for searching destinations
export function useSearchDestinations() {
  const [destinations, setDestinations] = useState<SearchDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const searchDestinations = async (filters: SearchFilters, limit: number = 12, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Searching destinations with filters:', filters);

      const variables = {
        ...filters,
        limit,
        offset
      };

      const result = await graphqlClient.request<{
        searchDestinations: {
          destinations: SearchDestination[];
          totalCount: number;
          hasMore: boolean;
        };
      }>(SEARCH_DESTINATIONS_QUERY, variables);

      const searchData = result.searchDestinations;
      
      if (offset === 0) {
        // New search - replace results
        setDestinations(searchData.destinations);
      } else {
        // Load more - append results
        setDestinations(prev => [...prev, ...searchData.destinations]);
      }
      
      setTotalCount(searchData.totalCount);
      setHasMore(searchData.hasMore);

      console.log('✅ Destinations search completed:', {
        destinationsCount: searchData.destinations.length,
        totalCount: searchData.totalCount,
        hasMore: searchData.hasMore
      });

    } catch (err: any) {
      console.error('❌ Error searching destinations:', err);
      setError(err.message || 'Failed to search destinations');
      
      // Fallback to mock data for development
      const mockDestinations: SearchDestination[] = [
        {
          id: '1',
          name: 'Santorini',
          slug: 'santorini-greece',
          country: {
            id: '1',
            name: 'Greece',
            code: 'GR',
            continent: 'Europe'
          },
          type: 'Island',
          season: 'Summer',
          description: 'Beautiful Greek island with stunning sunsets',
          highlights: ['Sunsets', 'Architecture', 'Beaches'],
          image: '/api/placeholder/600/400',
          gallery: ['/api/placeholder/600/400'],
          rating: 4.8,
          reviewCount: 156,
          priceFrom: 400000, // 4000 GHS in pesewas
          duration: '5-7 days',
          bestTime: 'April to October',
          climate: 'Mediterranean',
          activities: ['Sightseeing', 'Photography', 'Relaxation'],
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ];
      
      setDestinations(mockDestinations);
      setTotalCount(1);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    destinations,
    loading,
    error,
    totalCount,
    hasMore,
    searchDestinations
  };
}

// Hook for getting search filters/options
export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFiltersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since the backend doesn't have searchFilters query yet, use fallback data
      console.log('⚠️ Using fallback search filters (backend searchFilters query not implemented yet)');
      
      // Fallback to mock data for development
      const mockFilters: SearchFiltersData = {
        continents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
        countries: [
          { id: '1', name: 'Ghana', code: 'GH', continent: 'Africa' },
          { id: '2', name: 'Greece', code: 'GR', continent: 'Europe' },
          { id: '3', name: 'Japan', code: 'JP', continent: 'Asia' },
          { id: '4', name: 'Switzerland', code: 'CH', continent: 'Europe' },
          { id: '5', name: 'Tanzania', code: 'TZ', continent: 'Africa' },
          { id: '6', name: 'France', code: 'FR', continent: 'Europe' },
          { id: '7', name: 'Thailand', code: 'TH', continent: 'Asia' },
          { id: '8', name: 'USA', code: 'US', continent: 'North America' }
        ],
        tourCategories: ['Adventure', 'Cultural', 'Beach', 'Nature', 'City', 'Photography'],
        tourFeatures: ['All Meals', 'Airport Transfers', 'Professional Guide', 'Small Groups', 'Luxury Accommodation', 'Photography Focus', 'Cultural Immersion'],
        destinationTypes: ['City', 'Island', 'Mountains', 'Beach', 'Desert', 'Forest'],
        seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
        priceRanges: [
          { min: 0, max: 100000, label: 'Under ₵1,000' },
          { min: 100000, max: 250000, label: '₵1,000 - ₵2,500' },
          { min: 250000, max: 500000, label: '₵2,500 - ₵5,000' },
          { min: 500000, max: 999999999, label: 'Over ₵5,000' }
        ],
        durationOptions: ['1-3 days', '4-7 days', '1-2 weeks', '2+ weeks']
      };
      
      setFilters(mockFilters);
      console.log('✅ Search filters loaded (fallback data):', mockFilters);

    } catch (err: any) {
      console.error('❌ Error fetching search filters:', err);
      setError(err.message || 'Failed to fetch search filters');
      
      // Even if there's an error, provide fallback data
      const fallbackFilters: SearchFiltersData = {
        continents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
        countries: [
          { id: '1', name: 'Ghana', code: 'GH', continent: 'Africa' },
          { id: '2', name: 'Greece', code: 'GR', continent: 'Europe' },
          { id: '3', name: 'Japan', code: 'JP', continent: 'Asia' },
          { id: '4', name: 'Switzerland', code: 'CH', continent: 'Europe' }
        ],
        tourCategories: ['Adventure', 'Cultural', 'Beach', 'Nature', 'City', 'Photography'],
        tourFeatures: ['All Meals', 'Airport Transfers', 'Professional Guide', 'Small Groups', 'Luxury Accommodation'],
        destinationTypes: ['City', 'Island', 'Mountains', 'Beach', 'Desert', 'Forest'],
        seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
        priceRanges: [
          { min: 0, max: 100000, label: 'Under ₵1,000' },
          { min: 100000, max: 250000, label: '₵1,000 - ₵2,500' },
          { min: 250000, max: 500000, label: '₵2,500 - ₵5,000' },
          { min: 500000, max: 999999999, label: 'Over ₵5,000' }
        ],
        durationOptions: ['1-3 days', '4-7 days', '1-2 weeks', '2+ weeks']
      };
      
      setFilters(fallbackFilters);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  return {
    filters,
    loading,
    error,
    refetch: fetchFilters
  };
}
