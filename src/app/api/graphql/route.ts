import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'graphql';

// GraphQL Schema Definition
const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    SUPER_ADMIN
    CONTENT_MANAGER
    CUSTOMER_SERVICE
    MARKETING
    EDITOR
  }

  type Destination {
    id: ID!
    name: String!
    country: String!
    continent: String!
    type: String!
    season: String!
    image: String!
    gallery: [String!]!
    description: String!
    highlights: [String!]!
    rating: Float!
    reviewCount: Int!
    tourCount: Int!
    priceFrom: Int!
    duration: String!
    bestTime: String!
    featured: Boolean!
    climate: String!
    activities: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Tour {
    id: ID!
    title: String!
    slug: String!
    destination: Destination!
    description: String!
    highlights: [String!]!
    inclusions: [String!]!
    exclusions: [String!]!
    duration: Int!
    groupSize: Int!
    difficulty: String!
    priceFrom: Int!
    image: String
    images: [String!]!
    itinerary: [ItineraryDay!]!
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type ItineraryDay {
    day: Int!
    title: String!
    description: String!
    meals: [String!]!
    accommodation: String
  }

  type BlogPost {
    id: ID!
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    author: String!
    publishedAt: String
    category: String!
    tags: [String!]!
    image: String!
    featured: Boolean!
    status: PostStatus!
    createdAt: String!
    updatedAt: String!
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type Booking {
    id: ID!
    tour: Tour!
    customerName: String!
    customerEmail: String!
    customerPhone: String!
    travelers: Int!
    startDate: String!
    totalPrice: Int!
    status: BookingStatus!
    createdAt: String!
    updatedAt: String!
  }

  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  type Analytics {
    totalBookings: Int!
    totalRevenue: Int!
    popularDestinations: [Destination!]!
    recentBookings: [Booking!]!
    monthlyStats: [MonthlyStats!]!
  }

  type MonthlyStats {
    month: String!
    bookings: Int!
    revenue: Int!
  }

  type Query {
    # Authentication
    me: User

    # Destinations
    destinations(featured: Boolean): [Destination!]!
    destination(id: ID!): Destination

    # Tours
    tours(destinationId: ID, featured: Boolean): [Tour!]!
    tour(id: ID!): Tour

    # Blog
    blogPosts(status: PostStatus, featured: Boolean): [BlogPost!]!
    blogPost(id: ID!): BlogPost

    # Bookings
    bookings(status: BookingStatus): [Booking!]!
    booking(id: ID!): Booking

    # Analytics
    analytics: Analytics!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!

    # Destinations
    createDestination(input: CreateDestinationInput!): Destination!
    updateDestination(id: ID!, input: UpdateDestinationInput!): Destination!
    deleteDestination(id: ID!): Boolean!

    # Tours
    createTour(input: CreateTourInput!): Tour!
    updateTour(id: ID!, input: UpdateTourInput!): Tour!
    deleteTour(id: ID!): Boolean!

    # Blog
    createBlogPost(input: CreateBlogPostInput!): BlogPost!
    updateBlogPost(id: ID!, input: UpdateBlogPostInput!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!

    # Bookings
    updateBookingStatus(id: ID!, status: BookingStatus!): Booking!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateDestinationInput {
    name: String!
    country: String!
    continent: String!
    type: String!
    season: String!
    image: String!
    gallery: [String!]!
    description: String!
    highlights: [String!]!
    priceFrom: Int!
    duration: String!
    bestTime: String!
    climate: String!
    activities: [String!]!
    featured: Boolean
  }

  input UpdateDestinationInput {
    name: String
    country: String
    continent: String
    type: String
    season: String
    image: String
    gallery: [String!]
    description: String
    highlights: [String!]
    priceFrom: Int
    duration: String
    bestTime: String
    climate: String
    activities: [String!]
    featured: Boolean
  }

  input CreateTourInput {
    title: String!
    destinationId: ID!
    description: String!
    highlights: [String!]!
    inclusions: [String!]!
    exclusions: [String!]!
    duration: Int!
    groupSize: Int!
    difficulty: String!
    priceFrom: Int!
    images: [String!]!
    itinerary: [ItineraryDayInput!]!
    featured: Boolean
  }

  input UpdateTourInput {
    title: String
    destinationId: ID
    description: String
    highlights: [String!]
    inclusions: [String!]
    exclusions: [String!]
    duration: Int
    groupSize: Int
    difficulty: String
    priceFrom: Int
    image: String
    images: [String!]
    itinerary: [ItineraryDayInput!]
    featured: Boolean
  }

  input ItineraryDayInput {
    day: Int!
    title: String!
    description: String!
    meals: [String!]!
    accommodation: String
  }

  input CreateBlogPostInput {
    title: String!
    excerpt: String!
    content: String!
    author: String!
    category: String!
    tags: [String!]!
    image: String!
    featured: Boolean
    status: PostStatus
  }

  input UpdateBlogPostInput {
    title: String
    excerpt: String
    content: String
    author: String
    category: String
    tags: [String!]
    image: String
    featured: Boolean
    status: PostStatus
  }
`;

// Mock data for development
const mockDestinations = [
  {
    id: '1',
    name: 'Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    type: 'Mountains',
    season: 'All Year',
    image: '/api/placeholder/600/400',
    gallery: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    description: 'Experience the breathtaking beauty of snow-capped peaks.',
    highlights: ['Matterhorn Views', 'Scenic Train Rides', 'Alpine Villages'],
    rating: 4.9,
    reviewCount: 1247,
    tourCount: 15,
    priceFrom: 2499,
    duration: '7-14 days',
    bestTime: 'June - September',
    featured: true,
    climate: 'Alpine',
    activities: ['Hiking', 'Skiing', 'Photography'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockUsers = [
  {
    id: '1',
    email: 'admin@traveladdict.com',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// GraphQL Resolvers
const resolvers = {
  Query: {
    me: () => mockUsers[0],
    destinations: () => mockDestinations,
    destination: (_: any, { id }: { id: string }) => 
      mockDestinations.find(dest => dest.id === id),
    tours: () => [],
    tour: () => null,
    blogPosts: () => [],
    blogPost: () => null,
    bookings: () => [],
    booking: () => null,
    analytics: () => ({
      totalBookings: 0,
      totalRevenue: 0,
      popularDestinations: [],
      recentBookings: [],
      monthlyStats: []
    })
  },
  Mutation: {
    login: (_: any, { email, password }: { email: string, password: string }) => {
      // Mock authentication
      if (email === 'admin@traveladdict.com' && password === 'admin123') {
        return {
          token: 'mock-jwt-token',
          user: mockUsers[0]
        };
      }
      throw new Error('Invalid credentials');
    },
    logout: () => true,
    createDestination: (_: any, { input }: { input: any }) => {
      const newDestination = {
        id: String(mockDestinations.length + 1),
        ...input,
        rating: 0,
        reviewCount: 0,
        tourCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDestinations.push(newDestination);
      return newDestination;
    },
    updateDestination: (_: any, { id, input }: { id: string, input: any }) => {
      const index = mockDestinations.findIndex(dest => dest.id === id);
      if (index === -1) throw new Error('Destination not found');
      
      mockDestinations[index] = {
        ...mockDestinations[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      return mockDestinations[index];
    },
    deleteDestination: (_: any, { id }: { id: string }) => {
      const index = mockDestinations.findIndex(dest => dest.id === id);
      if (index === -1) return false;
      
      mockDestinations.splice(index, 1);
      return true;
    },
    createTour: () => { throw new Error('Not implemented yet'); },
    updateTour: () => { throw new Error('Not implemented yet'); },
    deleteTour: () => { throw new Error('Not implemented yet'); },
    createBlogPost: () => { throw new Error('Not implemented yet'); },
    updateBlogPost: () => { throw new Error('Not implemented yet'); },
    deleteBlogPost: () => { throw new Error('Not implemented yet'); },
    updateBookingStatus: () => { throw new Error('Not implemented yet'); },
  }
};

const schema = buildSchema(typeDefs);

const yoga = createYoga({
  schema,
  rootValue: resolvers,
  graphqlEndpoint: '/api/graphql',
  context: async ({ request }) => {
    // Add authentication context here
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    return {
      token,
      // Add user context based on token
    };
  },
});

export {
  yoga as GET,
  yoga as POST,
  yoga as OPTIONS,
};
