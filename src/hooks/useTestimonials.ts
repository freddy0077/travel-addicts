import { useState, useEffect } from 'react';
import { graphqlClient } from '@/lib/graphql-client';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
}

// Query tours with their reviews to get testimonials
const TESTIMONIALS_QUERY = `
  query GetTestimonials {
    tours(featured: true) {
      id
      title
      reviews {
        id
        rating
        content
        customer {
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`;

export function useTestimonials(limit: number = 3) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await graphqlClient.request<{
          tours: Array<{
            id: string;
            title: string;
            reviews: Array<{
              id: string;
              rating: number;
              content: string;
              customer?: {
                firstName: string;
                lastName: string;
              };
              createdAt: string;
            }>;
          }>;
        }>(TESTIMONIALS_QUERY);

        // Extract and transform reviews from tours into testimonials
        const allReviews: Testimonial[] = [];
        
        result.tours?.forEach(tour => {
          tour.reviews?.forEach(review => {
            if (review.rating >= 4 && review.content) { // Only high-rated reviews with content
              allReviews.push({
                id: review.id,
                name: review.customer 
                  ? `${review.customer.firstName} ${review.customer.lastName}`
                  : 'Anonymous Traveler',
                location: 'Travel Enthusiast', // Default location since we don't have this data
                image: '/images/default-avatar.jpg', // Default avatar
                rating: review.rating,
                text: review.content
              });
            }
          });
        });

        // Sort by rating (highest first) and take the limit
        const sortedReviews = allReviews
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);

        setTestimonials(sortedReviews);

      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError(error instanceof Error ? error.message : 'Failed to load testimonials');
        // Set empty array on error instead of fallback data
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [limit]);

  const refetch = () => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await graphqlClient.request<{
          tours: Array<{
            id: string;
            title: string;
            reviews: Array<{
              id: string;
              rating: number;
              content: string;
              customer?: {
                firstName: string;
                lastName: string;
              };
              createdAt: string;
            }>;
          }>;
        }>(TESTIMONIALS_QUERY);

        // Extract and transform reviews from tours into testimonials
        const allReviews: Testimonial[] = [];
        
        result.tours?.forEach(tour => {
          tour.reviews?.forEach(review => {
            if (review.rating >= 4 && review.content) {
              allReviews.push({
                id: review.id,
                name: review.customer 
                  ? `${review.customer.firstName} ${review.customer.lastName}`
                  : 'Anonymous Traveler',
                location: 'Travel Enthusiast',
                image: '/images/default-avatar.jpg',
                rating: review.rating,
                text: review.content
              });
            }
          });
        });

        const sortedReviews = allReviews
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);

        setTestimonials(sortedReviews);

      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to load testimonials');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  };

  return {
    testimonials,
    loading,
    error,
    refetch
  };
}
