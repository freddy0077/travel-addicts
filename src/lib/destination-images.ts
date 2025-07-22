// Destination Image Mapping Utility
// Maps destination types and characteristics to appropriate African hero images

export interface DestinationImage {
  filename: string;
  destination: string;
  description: string;
  path: string;
  keywords: string[];
  type: 'safari' | 'beach' | 'mountain' | 'desert' | 'waterfall' | 'city' | 'cultural';
}

export const africanHeroImages: DestinationImage[] = [
  {
    filename: 'serengeti-migration.jpg',
    destination: 'Serengeti National Park',
    description: 'Wildebeest migration in Serengeti',
    path: '/images/destinations/serengeti-migration.jpg',
    keywords: ['safari', 'wildlife', 'migration', 'animals', 'national park', 'tanzania'],
    type: 'safari'
  },
  {
    filename: 'kilimanjaro-sunrise.jpg',
    destination: 'Mount Kilimanjaro',
    description: 'Mount Kilimanjaro at sunrise',
    path: '/images/destinations/kilimanjaro-sunrise.jpg',
    keywords: ['mountain', 'hiking', 'trekking', 'sunrise', 'peak', 'tanzania', 'adventure'],
    type: 'mountain'
  },
  {
    filename: 'victoria-falls.jpg',
    destination: 'Victoria Falls',
    description: 'Victoria Falls with rainbow mist',
    path: '/images/destinations/victoria-falls.jpg',
    keywords: ['waterfall', 'falls', 'rainbow', 'mist', 'zambia', 'zimbabwe', 'natural wonder'],
    type: 'waterfall'
  },
  {
    filename: 'zanzibar-beach.jpg',
    destination: 'Zanzibar',
    description: 'Zanzibar pristine beach with dhow',
    path: '/images/destinations/zanzibar-beach.jpg',
    keywords: ['beach', 'ocean', 'dhow', 'tropical', 'island', 'tanzania', 'coast'],
    type: 'beach'
  },
  {
    filename: 'sossusvlei-dunes.jpg',
    destination: 'Sossusvlei',
    description: 'Red sand dunes of Sossusvlei',
    path: '/images/destinations/sossusvlei-dunes.jpg',
    keywords: ['desert', 'dunes', 'sand', 'namibia', 'red', 'landscape'],
    type: 'desert'
  },
  {
    filename: 'cape-town-table-mountain.jpg',
    destination: 'Cape Town',
    description: 'Table Mountain and Cape Town skyline',
    path: '/images/destinations/cape-town-table-mountain.jpg',
    keywords: ['city', 'mountain', 'skyline', 'cape town', 'south africa', 'urban'],
    type: 'city'
  },
  {
    filename: 'masai-mara-balloon.jpg',
    destination: 'Masai Mara',
    description: 'Hot air balloon safari over Masai Mara',
    path: '/images/destinations/masai-mara-balloon.jpg',
    keywords: ['safari', 'balloon', 'wildlife', 'kenya', 'masai', 'adventure'],
    type: 'safari'
  },
  {
    filename: 'kruger-national-park.jpg',
    destination: 'Kruger National Park',
    description: 'Wildlife in Kruger National Park',
    path: '/images/destinations/kruger-national-park.jpg',
    keywords: ['safari', 'wildlife', 'national park', 'south africa', 'animals'],
    type: 'safari'
  },
  {
    filename: 'pyramids-giza-egypt.jpg',
    destination: 'Pyramids of Giza',
    description: 'Ancient pyramids of Giza',
    path: '/images/destinations/pyramids-giza-egypt.jpg',
    keywords: ['pyramids', 'ancient', 'egypt', 'historical', 'cultural', 'desert'],
    type: 'cultural'
  },
  {
    filename: 'sahara-desert-morocco.jpg',
    destination: 'Sahara Desert',
    description: 'Sahara Desert landscape',
    path: '/images/destinations/sahara-desert-morocco.jpg',
    keywords: ['desert', 'sahara', 'morocco', 'dunes', 'sand', 'landscape'],
    type: 'desert'
  }
];

// Default fallback image for destinations without specific matches
export const defaultAfricanHeroImage: DestinationImage = {
  filename: 'serengeti-migration.jpg',
  destination: 'African Safari',
  description: 'Beautiful African landscape',
  path: '/images/destinations/serengeti-migration.jpg',
  keywords: ['africa', 'safari', 'wildlife'],
  type: 'safari'
};

/**
 * Intelligently selects the most appropriate African hero image for a destination
 * based on destination name, type, activities, and characteristics
 */
export function getDestinationHeroImage(destination: {
  name: string;
  type?: string;
  activities?: string[];
  description?: string;
  country?: { name: string; continent: string };
}): DestinationImage {
  const searchText = [
    destination.name,
    destination.type,
    ...(destination.activities || []),
    destination.description,
    destination.country?.name
  ].join(' ').toLowerCase();

  // Score each image based on keyword matches
  const scoredImages = africanHeroImages.map(image => {
    let score = 0;
    
    // Direct destination name match (highest priority)
    if (searchText.includes(image.destination.toLowerCase())) {
      score += 100;
    }
    
    // Keyword matches
    image.keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
    
    // Type-based matching
    if (destination.type) {
      const destType = destination.type.toLowerCase();
      if (destType.includes('safari') && image.type === 'safari') score += 50;
      if (destType.includes('beach') && image.type === 'beach') score += 50;
      if (destType.includes('mountain') && image.type === 'mountain') score += 50;
      if (destType.includes('desert') && image.type === 'desert') score += 50;
      if (destType.includes('city') && image.type === 'city') score += 50;
      if (destType.includes('cultural') && image.type === 'cultural') score += 50;
    }
    
    // Activity-based matching
    if (destination.activities) {
      destination.activities.forEach(activity => {
        const activityLower = activity.toLowerCase();
        if (activityLower.includes('safari') && image.type === 'safari') score += 30;
        if (activityLower.includes('beach') && image.type === 'beach') score += 30;
        if (activityLower.includes('hiking') && image.type === 'mountain') score += 30;
        if (activityLower.includes('wildlife') && image.type === 'safari') score += 30;
      });
    }
    
    return { image, score };
  });
  
  // Sort by score and return the best match
  scoredImages.sort((a, b) => b.score - a.score);
  
  // Return the highest scoring image, or default if no good matches
  return scoredImages[0]?.score > 0 ? scoredImages[0].image : defaultAfricanHeroImage;
}

/**
 * Gets a gallery of related African images for a destination
 */
export function getDestinationImageGallery(destination: {
  name: string;
  type?: string;
  activities?: string[];
}): DestinationImage[] {
  const heroImage = getDestinationHeroImage(destination);
  
  // Get 3-4 related images excluding the hero image
  const relatedImages = africanHeroImages
    .filter(img => img.filename !== heroImage.filename)
    .slice(0, 4);
    
  return [heroImage, ...relatedImages];
}

/**
 * Gets images by specific type
 */
export function getImagesByType(type: DestinationImage['type']): DestinationImage[] {
  return africanHeroImages.filter(img => img.type === type);
}

/**
 * Gets a random African hero image
 */
export function getRandomAfricanHeroImage(): DestinationImage {
  const randomIndex = Math.floor(Math.random() * africanHeroImages.length);
  return africanHeroImages[randomIndex];
}
