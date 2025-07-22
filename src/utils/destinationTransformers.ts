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
  console.log('groupDestinationsByContinent called with:', destinations);
  
  if (!destinations || destinations.length === 0) {
    console.log('No destinations to group');
    return [];
  }

  const continentMap = new Map<string, PopularDestination[]>();

  // Group destinations by continent
  destinations.forEach(destination => {
    const continent = destination.country.continent;
    console.log('Processing destination:', destination.name, 'continent:', continent);
    
    if (!continentMap.has(continent)) {
      continentMap.set(continent, []);
    }
    continentMap.get(continent)!.push(destination);
  });

  console.log('Continent map:', continentMap);

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
    const image = destinations[0]?.image || '/api/placeholder/300/200';

    console.log(`Continent ${continent}: ${destinations.length} destinations, ${estimatedTours} estimated tours`);

    continentDestinations.push({
      continent,
      destinations,
      totalTours: estimatedTours,
      image
    });
  });

  console.log('Final continent destinations:', continentDestinations);
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
  console.log('🔍 getFeaturedDestinationsForHome called with:');
  console.log('  - destinations:', destinations);
  console.log('  - destinations length:', destinations?.length);
  console.log('  - limit:', limit);
  
  if (!destinations || destinations.length === 0) {
    console.log('❌ No destinations provided, returning fallback data');
    console.log('  - fallback destinations:', fallbackDestinations.slice(0, limit));
    return fallbackDestinations.slice(0, limit);
  }
  
  const continentGroups = groupDestinationsByContinent(destinations);
  console.log('🌍 Continent groups created:', continentGroups);
  
  // Sort by total tours (most popular first)
  const sortedGroups = continentGroups.sort((a, b) => b.totalTours - a.totalTours);
  console.log('📊 Sorted groups:', sortedGroups);
  
  // Take the top continents up to the limit
  const limitedGroups = sortedGroups.slice(0, limit);
  console.log('✂️ Limited groups:', limitedGroups);
  
  const result = limitedGroups.map(group => ({
    name: group.continent,
    image: group.image,
    tours: group.totalTours,
    continent: group.continent,
    slug: group.continent.toLowerCase().replace(/\s+/g, '-')
  }));
  
  console.log('✅ Final transformed destinations:', result);
  console.log('📈 Result length:', result.length);
  return result;
}

// Fallback destinations data matching the original home page format
export const fallbackDestinations: HomeDestination[] = [
  { name: 'Europe', image: '/api/placeholder/300/200', tours: 45 },
  { name: 'Asia', image: '/api/placeholder/300/200', tours: 32 },
  { name: 'Africa', image: '/api/placeholder/300/200', tours: 18 },
  { name: 'South America', image: '/api/placeholder/300/200', tours: 24 },
  { name: 'North America', image: '/api/placeholder/300/200', tours: 28 },
  { name: 'Oceania', image: '/api/placeholder/300/200', tours: 15 }
];
