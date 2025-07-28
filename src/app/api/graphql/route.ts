import { createYoga } from 'graphql-yoga'
import { NextRequest } from 'next/server'

const { handleRequest } = createYoga({
  schema: {
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String
        destinations: [Destination!]!
        tours: [Tour!]!
      }

      type Destination {
        id: ID!
        name: String!
        country: String!
        continent: String!
        description: String!
        image: String!
        priceFrom: Int!
        rating: Float!
        reviewCount: Int!
        tourCount: Int!
      }

      type Tour {
        id: ID!
        title: String!
        slug: String!
        description: String!
        price: Int!
        originalPrice: Int
        duration: Int!
        groupSize: Int!
        rating: Float!
        reviewCount: Int!
        images: [String!]!
        destination: Destination!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello from GraphQL Yoga + Next.js App Router!',
        destinations: () => [
          {
            id: '1',
            name: 'Serengeti National Park',
            country: 'Tanzania',
            continent: 'Africa',
            description: 'Experience the great migration in Tanzania\'s most famous national park.',
            image: '/images/destinations/serengeti-migration.jpg',
            priceFrom: 160, // 160 USD
            rating: 4.8,
            reviewCount: 156,
            tourCount: 12
          },
          {
            id: '2',
            name: 'Cape Town',
            country: 'South Africa',
            continent: 'Africa',
            description: 'Discover the beauty of Table Mountain and vibrant city life.',
            image: '/images/destinations/cape-town-table-mountain.jpg',
            priceFrom: 115, // 115 USD
            rating: 4.7,
            reviewCount: 203,
            tourCount: 8
          }
        ],
        tours: () => [
          {
            id: '1',
            title: 'Serengeti Safari Adventure',
            slug: 'serengeti-safari-adventure',
            description: 'An unforgettable 7-day safari experience in the Serengeti.',
            price: 225, // 225 USD
            originalPrice: 260,
            duration: 7,
            groupSize: 12,
            rating: 4.9,
            reviewCount: 89,
            images: [
              '/images/destinations/serengeti-migration.jpg',
              '/images/destinations/masai-mara-balloon.jpg'
            ],
            destination: {
              id: '1',
              name: 'Serengeti National Park',
              country: 'Tanzania',
              continent: 'Africa',
              description: 'Experience the great migration in Tanzania\'s most famous national park.',
              image: '/images/destinations/serengeti-migration.jpg',
              priceFrom: 160,
              rating: 4.8,
              reviewCount: 156,
              tourCount: 12
            }
          }
        ]
      }
    }
  },
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response }
})

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request)
}
