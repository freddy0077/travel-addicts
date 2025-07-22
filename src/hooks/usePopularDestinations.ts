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
    } catch (err: any) {
      console.error('❌ Error fetching popular destinations:', err);
      setError(err.message || 'Failed to fetch popular destinations');
      
      console.log('🔄 Using fallback destinations due to error');
      // Fallback to sample data if API fails
      const fallbackDestinations: PopularDestination[] = [
        {
          id: '1',
          name: 'Paris',
          slug: 'paris-france',
          country: {
            id: '1',
            name: 'France',
            code: 'FR',
            continent: 'Europe'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.8,
          reviewCount: 245,
          priceFrom: 180000, // 1800 GHS in pesewas
          duration: '5-7 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Tokyo',
          slug: 'tokyo-japan',
          country: {
            id: '2',
            name: 'Japan',
            code: 'JP',
            continent: 'Asia'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.9,
          reviewCount: 189,
          priceFrom: 220000, // 2200 GHS in pesewas
          duration: '7-10 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T14:15:00Z'
        },
        {
          id: '3',
          name: 'Cape Town',
          slug: 'cape-town-south-africa',
          country: {
            id: '3',
            name: 'South Africa',
            code: 'ZA',
            continent: 'Africa'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.7,
          reviewCount: 156,
          priceFrom: 150000, // 1500 GHS in pesewas
          duration: '6-8 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-25T09:45:00Z'
        },
        {
          id: '4',
          name: 'Rio de Janeiro',
          slug: 'rio-de-janeiro-brazil',
          country: {
            id: '4',
            name: 'Brazil',
            code: 'BR',
            continent: 'South America'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.6,
          reviewCount: 134,
          priceFrom: 170000, // 1700 GHS in pesewas
          duration: '5-7 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-30T16:20:00Z'
        },
        {
          id: '5',
          name: 'New York',
          slug: 'new-york-usa',
          country: {
            id: '5',
            name: 'United States',
            code: 'US',
            continent: 'North America'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.8,
          reviewCount: 298,
          priceFrom: 250000, // 2500 GHS in pesewas
          duration: '4-6 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-02-01T11:10:00Z'
        },
        {
          id: '6',
          name: 'Sydney',
          slug: 'sydney-australia',
          country: {
            id: '6',
            name: 'Australia',
            code: 'AU',
            continent: 'Oceania'
          },
          type: 'City',
          image: '/api/placeholder/300/200',
          gallery: ['/api/placeholder/300/200'],
          rating: 4.7,
          reviewCount: 167,
          priceFrom: 280000, // 2800 GHS in pesewas
          duration: '7-9 Days',
          featured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-02-05T08:30:00Z'
        }
      ];
      
      setDestinations(fallbackDestinations);
      console.log('✅ Fallback destinations set in state successfully');
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
