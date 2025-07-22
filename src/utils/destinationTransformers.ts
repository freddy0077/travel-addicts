import { PopularDestination } from '@/hooks/usePopularDestinations';

// Transform API destination data to match home page format
export interface HomeDestination {
  name: string;
  image: string;
  tours: number;
  continent?: string;
  slug?: string;
}

export interface ContinentDestinations {
  continent: string;
  destinations: PopularDestination[];
  totalTours: number;
  image: string;
}

// Group destinations by continent and calculate estimated tour counts
export function groupDestinationsByContinent(destinations: PopularDestination[]): ContinentDestinations[] {
  if (!destinations || destinations.length === 0) {
    return [];
  }

  const continentMap = new Map<string, PopularDestination[]>();

  // Group destinations by continent
  destinations.forEach(destination => {
    const continent = destination.country.continent;
    
    if (!continentMap.has(continent)) {
      continentMap.set(continent, []);
    }
    continentMap.get(continent)!.push(destination);
  });

  // Transform to ContinentDestinations format
  const continentDestinations: ContinentDestinations[] = [];

  continentMap.forEach((destinations, continent) => {
    // Calculate estimated tours for this continent
    const estimatedTours = destinations.reduce((total, dest) => {
      const baseTours = Math.round(dest.rating * 10); // e.g., 4.8 rating = 48 tours
      const featuredBonus = dest.featured ? 5 : 0;
      return total + Math.max(baseTours + featuredBonus, 5); // Minimum 5 tours
    }, 0);

    // Use the first destination's image as continent representative
    const image = destinations[0]?.image || null;

    continentDestinations.push({
      continent,
      destinations,
      totalTours: estimatedTours,
      image
    });
  });

  return continentDestinations;
}

// Transform destinations to the simple home page format
export function transformDestinationsForHome(destinations: PopularDestination[]): HomeDestination[] {
  const continentGroups = groupDestinationsByContinent(destinations);
  
  return continentGroups.map(group => ({
    name: group.continent,
    image: group.image,
    tours: group.totalTours,
    continent: group.continent
  }));
}

// Get featured destinations (limit to 6 for home page)
export function getFeaturedDestinationsForHome(destinations: PopularDestination[] = [], limit: number = 6): HomeDestination[] {
  if (!destinations || destinations.length === 0) {
    return [];
  }
  
  const continentGroups = groupDestinationsByContinent(destinations);
  
  // Sort by total tours (most popular first)
  const sortedGroups = continentGroups.sort((a, b) => b.totalTours - a.totalTours);
  
  // Take the top continents up to the limit
  const limitedGroups = sortedGroups.slice(0, limit);
  
  const result = limitedGroups.map(group => ({
    name: group.continent,
    image: group.image,
    tours: group.totalTours,
    continent: group.continent,
    slug: group.continent.toLowerCase().replace(/\s+/g, '-')
  }));
  
  return result;
}

// Fallback destinations data matching the original home page format
export const fallbackDestinations: HomeDestination[] = [];
