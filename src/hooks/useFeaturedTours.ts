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
    } catch (err: any) {
      console.error('Error fetching featured tours:', err);
      setError(err.message || 'Failed to fetch featured tours');
      
      // Fallback to sample data if API fails
      const fallbackTours: FeaturedTour[] = [
        {
          id: '1',
          title: 'Romantic Paris & Loire Valley',
          slug: 'romantic-paris-loire-valley',
          destination: {
            id: '1',
            name: 'Paris',
            country: {
              name: 'France',
              code: 'FR'
            }
          },
          description: 'Experience the romance of Paris and the elegance of the Loire Valley on this unforgettable journey through France\'s most enchanting regions.',
          highlights: [
            'Private Seine River cruise',
            'Exclusive château wine tastings',
            'Expert local guides'
          ],
          duration: 8,
          groupSizeMax: 16,
          priceFrom: 289900, // 2899 GHS in pesewas
          images: ['/api/placeholder/400/300'],
          featured: true,
          reviews: [
            {
              id: '1',
              rating: 5,
              title: 'Absolutely magical!',
              content: 'This tour exceeded all our expectations. The attention to detail was incredible.',
              customer: {
                firstName: 'Sarah',
                lastName: 'Johnson'
              },
              createdAt: '2024-01-15T10:30:00Z'
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Tuscany Culinary Adventure',
          slug: 'tuscany-culinary-adventure',
          destination: {
            id: '2',
            name: 'Tuscany',
            country: {
              name: 'Italy',
              code: 'IT'
            }
          },
          description: 'Immerse yourself in the culinary traditions of Tuscany with cooking classes, vineyard tours, and authentic Italian experiences.',
          highlights: [
            'Cooking classes with local chefs',
            'Private vineyard tours',
            'Historic villa accommodations'
          ],
          duration: 10,
          groupSizeMax: 12,
          priceFrom: 329900, // 3299 GHS in pesewas
          images: ['/api/placeholder/400/300'],
          featured: true,
          reviews: [
            {
              id: '2',
              rating: 5,
              title: 'Culinary paradise!',
              content: 'The food, wine, and hospitality were beyond amazing. A true taste of Italy.',
              customer: {
                firstName: 'Michael',
                lastName: 'Chen'
              },
              createdAt: '2024-01-20T14:15:00Z'
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T14:15:00Z'
        },
        {
          id: '3',
          title: 'Majestic Swiss Alps',
          slug: 'majestic-swiss-alps',
          destination: {
            id: '3',
            name: 'Swiss Alps',
            country: {
              name: 'Switzerland',
              code: 'CH'
            }
          },
          description: 'Discover the breathtaking beauty of the Swiss Alps with scenic train journeys, mountain adventures, and luxury alpine experiences.',
          highlights: [
            'Scenic train journeys',
            'Mountain hiking adventures',
            'Luxury alpine resorts'
          ],
          duration: 12,
          groupSizeMax: 14,
          priceFrom: 419900, // 4199 GHS in pesewas
          images: ['/api/placeholder/400/300'],
          featured: true,
          reviews: [
            {
              id: '3',
              rating: 5,
              title: 'Breathtaking views!',
              content: 'The Swiss Alps are even more beautiful than in pictures. An unforgettable experience.',
              customer: {
                firstName: 'Emma',
                lastName: 'Thompson'
              },
              createdAt: '2024-01-25T09:45:00Z'
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-25T09:45:00Z'
        }
      ];
      
      setTours(limit ? fallbackTours.slice(0, limit) : fallbackTours);
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
