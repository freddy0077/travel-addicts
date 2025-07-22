'use client';

import { useState, useEffect } from 'react';
import { graphqlClient, FEATURED_TOURS_QUERY, SEARCH_DESTINATIONS_QUERY, GET_SEARCH_FILTERS_QUERY, SEARCH_TOURS_QUERY } from '@/lib/graphql-client';

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

    } catch (error) {
      console.error('Error searching tours:', error);
      setError(error instanceof Error ? error.message : 'Failed to search tours');
      setTours([]);
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

    } catch (error) {
      console.error('Error searching destinations:', error);
      setError(error instanceof Error ? error.message : 'Failed to search destinations');
      setDestinations([]);
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

      const result = await graphqlClient.request<{
        searchFilters: SearchFiltersData;
      }>(GET_SEARCH_FILTERS_QUERY);

      setFilters(result.searchFilters);
      console.log('✅ Search filters loaded:', result.searchFilters);

    } catch (error) {
      console.error('Error fetching search filters:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch search filters');
      setFilters(null);
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
