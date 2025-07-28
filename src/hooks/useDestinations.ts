import { useState, useEffect } from 'react';
import { graphqlClient, DESTINATIONS_QUERY } from '@/lib/graphql-client';

export interface Destination {
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
  priceFrom: number; // in USD
  duration: string;
  bestTime: string;
  climate: string;
  activities: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseDestinationsResult {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Transform API destination to match page format
export function transformDestinationForPage(destination: Destination) {
  return {
    id: destination.id, // Keep as string, don't convert to number
    name: destination.name,
    slug: destination.slug, // Add the missing slug field
    country: destination.country.name,
    continent: destination.country.continent,
    type: destination.type,
    season: destination.season,
    image: destination.image,
    gallery: destination.gallery,
    description: destination.description,
    highlights: destination.highlights,
    rating: destination.rating,
    reviewCount: destination.reviewCount,
    tourCount: Math.floor(Math.random() * 20) + 5, // Mock tour count for now
    priceFrom: destination.priceFrom, // Already in USD
    duration: destination.duration,
    bestTime: destination.bestTime,
    featured: destination.featured,
    climate: destination.climate,
    activities: destination.activities
  };
}

export function useDestinations(): UseDestinationsResult {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      console.log('🚀 Starting fetchDestinations...');
      setLoading(true);
      setError(null);
      
      console.log('📡 Making GraphQL request to fetch destinations...');
      const result = await graphqlClient.request<{ destinations: Destination[] }>(
        DESTINATIONS_QUERY
      );
      
      console.log('✅ Destinations fetched successfully:', result.destinations);
      setDestinations(result.destinations || []);
      
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load destinations');
      // Remove all mock data - use empty array instead
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations
  };
}
