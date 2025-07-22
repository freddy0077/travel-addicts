import { useState, useEffect } from 'react';
import { graphqlClient, DESTINATION_BY_SLUG_QUERY } from '@/lib/graphql-client';
import { Destination } from './useDestinations';

export interface DestinationWithTours extends Destination {
  tours: {
    id: string;
    title: string;
    slug: string;
    priceFrom: number;
    duration: string;
    rating: number;
    reviewCount: number;
    images: string[];
    featured: boolean;
  }[];
}

export interface UseDestinationResult {
  destination: DestinationWithTours | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Transform API destination data for the destination detail page
export function transformDestinationForDetail(destination: DestinationWithTours) {
  return {
    id: destination.id,
    name: destination.name,
    slug: destination.slug,
    country: destination.country.name,
    continent: destination.country.continent,
    type: destination.type,
    season: destination.season,
    description: destination.description,
    longDescription: destination.description, // Use description as long description for now
    images: destination.gallery.length > 0 ? destination.gallery : [destination.image],
    heroImage: destination.image,
    rating: destination.rating,
    reviewCount: destination.reviewCount,
    tourCount: destination.tours?.length || 0,
    priceFrom: Math.round(destination.priceFrom / 100), // Convert from pesewas to cedis
    duration: destination.duration,
    bestTime: destination.bestTime,
    climate: destination.climate,
    temperature: '24-30°C', // Default temperature range
    activities: destination.activities,
    highlights: destination.highlights,
    // Default accommodation data - in real app, this would come from API
    accommodation: [
      {
        name: `${destination.name} Resort`,
        type: 'Resort',
        rating: 4.5,
        priceFrom: Math.round(destination.priceFrom / 100) + 50,
        features: ['Beachfront', 'Restaurant', 'Wi-Fi', 'Pool']
      },
      {
        name: `${destination.name} Lodge`,
        type: 'Boutique Hotel',
        rating: 4.3,
        priceFrom: Math.round(destination.priceFrom / 100) + 20,
        features: ['Ocean View', 'Bar', 'Spa', 'Garden']
      },
      {
        name: `${destination.name} Eco Lodge`,
        type: 'Eco Lodge',
        rating: 4.2,
        priceFrom: Math.round(destination.priceFrom / 100) - 20,
        features: ['Eco-Friendly', 'Restaurant', 'Cultural Tours', 'Nature Walks']
      }
    ],
    // Default transportation data - in real app, this would come from API
    transportation: [
      {
        method: 'Flight + Drive',
        duration: '5-6 hours',
        description: `Fly to Accra, then drive to ${destination.name}`,
        cost: 'GH₵800-1200'
      },
      {
        method: 'Direct Drive',
        duration: '4-5 hours',
        description: `Direct drive from Accra to ${destination.name}`,
        cost: 'GH₵300-500'
      },
      {
        method: 'Bus + Taxi',
        duration: '6-7 hours',
        description: `Bus to nearest town, then taxi to ${destination.name}`,
        cost: 'GH₵150-250'
      }
    ],
    // Default nearby attractions - in real app, this would come from API
    nearbyAttractions: [
      {
        name: 'Local Historical Site',
        distance: '15 km',
        description: 'Historic site with cultural significance'
      },
      {
        name: 'Nature Reserve',
        distance: '20 km',
        description: 'Protected area with wildlife and nature trails'
      },
      {
        name: 'Traditional Village',
        distance: '10 km',
        description: 'Authentic local village experience'
      }
    ],
    // Default local tips
    localTips: [
      `Best time to visit ${destination.name} is during ${destination.bestTime}`,
      'Learn basic local phrases to connect with the community',
      'Try local cuisine and fresh ingredients',
      'Respect local customs and traditions',
      'Book accommodations in advance during peak season',
      'Bring appropriate clothing for the climate'
    ],
    featured: destination.featured,
    tours: destination.tours?.map(tour => ({
      ...tour,
      priceFrom: Math.round(tour.priceFrom / 100), // Convert from pesewas to cedis
      image: tour.images?.[0] || '/api/placeholder/400/300' // Use first image or placeholder
    })) || []
  };
}

export function useDestination(slug: string): UseDestinationResult {
  const [destination, setDestination] = useState<DestinationWithTours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestination = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await graphqlClient.request(DESTINATION_BY_SLUG_QUERY, { slug });
      
      if (response.destinationBySlug) {
        setDestination(response.destinationBySlug);
      } else {
        setDestination(null);
        setError('Destination not found');
      }
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Failed to load destination');
      setDestination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestination();
  }, [slug]);

  return {
    destination,
    loading,
    error,
    refetch: fetchDestination
  };
}
