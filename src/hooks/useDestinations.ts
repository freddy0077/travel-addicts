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
  priceFrom: number; // in pesewas
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
    priceFrom: Math.round(destination.priceFrom / 100), // Convert pesewas to cedis
    duration: destination.duration,
    bestTime: destination.bestTime,
    featured: destination.featured,
    climate: destination.climate,
    activities: destination.activities
  };
}

// Fallback destinations data for development
const fallbackDestinations: Destination[] = [
  {
    id: '1',
    name: 'Accra',
    slug: 'accra-ghana',
    country: {
      id: '1',
      name: 'Ghana',
      code: 'GH',
      continent: 'Africa'
    },
    type: 'City',
    season: 'All Year',
    description: 'Ghana\'s vibrant capital city with rich history, culture, and modern attractions.',
    highlights: ['Independence Square', 'National Museum', 'Makola Market', 'Labadi Beach'],
    image: '/api/placeholder/600/400',
    gallery: ['/api/placeholder/600/400'],
    rating: 4.5,
    reviewCount: 234,
    priceFrom: 15000, // 150 GHS in pesewas
    duration: '2-4 days',
    bestTime: 'November - March',
    climate: 'Tropical',
    activities: ['City Tours', 'Cultural Sites', 'Markets', 'Beaches'],
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Cape Coast',
    slug: 'cape-coast-ghana',
    country: {
      id: '1',
      name: 'Ghana',
      code: 'GH',
      continent: 'Africa'
    },
    type: 'Historical',
    season: 'All Year',
    description: 'Historic coastal city with slave castles and beautiful beaches.',
    highlights: ['Cape Coast Castle', 'Elmina Castle', 'Kakum National Park', 'Beaches'],
    image: '/api/placeholder/600/400',
    gallery: ['/api/placeholder/600/400'],
    rating: 4.7,
    reviewCount: 456,
    priceFrom: 20000, // 200 GHS in pesewas
    duration: '3-5 days',
    bestTime: 'November - March',
    climate: 'Tropical',
    activities: ['Historical Tours', 'Castle Visits', 'Beach Activities', 'Cultural Learning'],
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

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
      
    } catch (err) {
      console.error('❌ Error fetching destinations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
      
      // Use fallback data on error
      console.log('🔄 Using fallback destinations data');
      setDestinations(fallbackDestinations);
      
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
