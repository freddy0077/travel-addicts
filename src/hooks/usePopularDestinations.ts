'use client';

import { useState, useEffect } from 'react';
import { graphqlClient, POPULAR_DESTINATIONS_QUERY } from '@/lib/graphql-client';

export interface PopularDestination {
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
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  duration: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsePopularDestinationsResult {
  destinations: PopularDestination[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePopularDestinations(): UsePopularDestinationsResult {
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularDestinations = async () => {
    try {
      console.log('🚀 Starting fetchPopularDestinations...');
      setLoading(true);
      setError(null);
      
      console.log('📡 Making GraphQL request to:', POPULAR_DESTINATIONS_QUERY);
      const result = await graphqlClient.request<{ destinations: PopularDestination[] }>(
        POPULAR_DESTINATIONS_QUERY
      );
      
      console.log('📥 GraphQL response received:', result);
      const destinationsData = result.destinations || [];
      console.log('🎯 Extracted destinations data:', destinationsData);
      console.log('📊 Destinations count:', destinationsData.length);
      
      setDestinations(destinationsData);
      console.log('✅ Destinations set in state successfully');
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load destinations');
      setDestinations([]);
    } finally {
      setLoading(false);
      console.log('👍 fetchPopularDestinations completed');
    }
  };

  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    refetch: fetchPopularDestinations
  };
}
