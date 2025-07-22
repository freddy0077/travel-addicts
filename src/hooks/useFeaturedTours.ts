'use client';

import { useState, useEffect } from 'react';
import { graphqlClient, FEATURED_TOURS_QUERY } from '@/lib/graphql-client';

export interface FeaturedTour {
  id: string;
  title: string;
  slug: string;
  destination: {
    id: string;
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  description: string;
  highlights: string[];
  duration: number;
  groupSizeMax: number;
  priceFrom: number;
  images: string[];
  featured: boolean;
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
}

export interface UseFeaturedToursResult {
  tours: FeaturedTour[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeaturedTours(limit?: number): UseFeaturedToursResult {
  const [tours, setTours] = useState<FeaturedTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await graphqlClient.request<{ tours: FeaturedTour[] }>(
        FEATURED_TOURS_QUERY
      );
      
      let featuredTours = result.tours || [];
      
      // If limit is specified, slice the results
      if (limit && featuredTours.length > limit) {
        featuredTours = featuredTours.slice(0, limit);
      }
      
      setTours(featuredTours);
    } catch (error) {
      console.error('Error fetching featured tours:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tours');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedTours();
  }, [limit]);

  return {
    tours,
    loading,
    error,
    refetch: fetchFeaturedTours
  };
}
