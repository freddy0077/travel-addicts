// Brand Configuration
// This file centralizes all brand-related constants and environment variables

export const BRAND = {
  // Core Brand Identity
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Travel Addicts",
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || "Your Next Adventure Awaits",
  description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION || "At Travel Addicts, we believe travel is more than just a destination — it's an experience. We create unforgettable journeys through exceptional service, attention to detail, and a deep love for adventure.",
  
  // Mission & Vision
  mission: "At Travel Addicts, our mission is to connect people to unforgettable experiences by providing exceptional travel and tourism services with passion, integrity, and personalized care. We are committed to delivering seamless adventures that inspire, educate, and create lasting memories — making every journey with us a truly remarkable one.",
  
  vision: "To become a leading travel and tourism brand recognized for redefining the travel experience — connecting people to the world through authentic adventures, exceptional service, and a commitment to creating meaningful, lasting memories across destinations.",
  
  // About Us
  about: "At Travel Addicts, we believe travel is more than just a destination — it's an experience. As a passionate travel and tourism company, we are dedicated to creating unforgettable journeys through exceptional service, attention to detail, and a deep love for adventure. Whether it's cultural tours, exotic getaways, group expeditions, or tailored travel experiences, our team goes the extra mile to deliver seamless, memorable moments for every client. With Travel Addicts, your next adventure comes with the promise of professionalism, care, and the joy of discovery.",
  
  // Contact Information
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@traveladdicts.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+233 123 456 789",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Accra, Ghana",
  
  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/traveladdicts",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/traveladdicts",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/traveladdicts",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/company/traveladdicts",
  },
  
  // SEO & Metadata
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://traveladdicts.com",
  defaultOgImage: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE || "/og-image.jpg",
  
  // Business Information
  foundedYear: 2020,
  stats: {
    destinations: "50+",
    happyTravelers: "10K+",
    awards: "15+",
    averageRating: "4.9"
  }
} as const;

// SEO Helper Functions
export const getSEOTitle = (pageTitle?: string) => {
  return pageTitle ? `${pageTitle} | ${BRAND.name}` : `${BRAND.name} - ${BRAND.tagline}`;
};

export const getSEODescription = (pageDescription?: string) => {
  return pageDescription || BRAND.description;
};

// Logo Configuration (keeping the original logo design)
export const LOGO = {
  // You can customize logo text here if needed, but keeping original design
  text: "TA", // Travel Addicts initials
  showFullName: true, // Set to true if you want to show full name in logo
} as const;
