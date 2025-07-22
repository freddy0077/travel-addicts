import { FeaturedTour } from '@/hooks/useFeaturedTours';
import { convertPesewasToCedis } from '@/lib/graphql-client';

// Transform API tour data to match home page format
export interface HomeTour {
  id: string;
  title: string;
  destination: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  slug: string;
  featured?: boolean;
}

export function transformFeaturedTourForHome(tour: FeaturedTour): HomeTour {
  // Calculate average rating from reviews
  const averageRating = tour.reviews.length > 0 
    ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length
    : 4.8; // Default rating if no reviews

  // Get the first image or use placeholder
  const image = tour.images && tour.images.length > 0 
    ? tour.images[0] 
    : '/api/placeholder/400/300';

  // Convert price from pesewas to cedis
  const priceInCedis = convertPesewasToCedis(tour.priceFrom);

  return {
    id: tour.id,
    title: tour.title,
    destination: tour.destination.country.name,
    image,
    price: priceInCedis,
    duration: `${tour.duration} Days`,
    groupSize: `Max ${tour.groupSizeMax}`,
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    reviewCount: tour.reviews.length,
    highlights: tour.highlights.slice(0, 3), // Take first 3 highlights
    slug: tour.slug,
    featured: tour.featured
  };
}

export function transformFeaturedToursForHome(tours: FeaturedTour[]): HomeTour[] {
  return tours.map(transformFeaturedTourForHome);
}

// Helper function to format tour data for TourCard component
export function formatTourForCard(tour: HomeTour) {
  return {
    ...tour,
    priceFormatted: `₵${tour.price.toLocaleString()}`,
    originalPriceFormatted: tour.originalPrice ? `₵${tour.originalPrice.toLocaleString()}` : undefined,
    ratingDisplay: tour.rating.toFixed(1),
    reviewText: tour.reviewCount === 1 ? '1 review' : `${tour.reviewCount} reviews`
  };
}
