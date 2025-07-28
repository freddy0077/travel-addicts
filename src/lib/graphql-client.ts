import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

class GraphQLClientSingleton {
  private client: GraphQLClient;
  private token: string | null = null;

  constructor() {
    this.client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {},
    });
  }

  setAuthToken(token: string) {
    this.token = token;
    this.client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  }

  clearAuthToken() {
    this.token = null;
    this.client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {},
    });
  }

  getClient() {
    return this.client;
  }

  async request<T = any>(query: string, variables?: any, headers?: Record<string, string>): Promise<T> {
    try {
      // Create a temporary client with merged headers if headers are provided
      if (headers) {
        const tempClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
          headers: {
            ...this.client.requestConfig.headers,
            ...headers,
          },
        });
        return await tempClient.request<T>(query, variables);
      }
      
      return await this.client.request<T>(query, variables);
    } catch (error) {
      console.error('GraphQL request error:', error);
      throw error;
    }
  }
}

export const graphqlClient = new GraphQLClientSingleton();

// GraphQL Queries
export const DESTINATIONS_QUERY = `
  query GetDestinations {
    destinations {
      id
      name
      slug
      country {
        id
        name
        code
        continent
      }
      type
      season
      description
      highlights
      image
      gallery
      rating
      reviewCount
      priceFrom
      duration
      bestTime
      climate
      activities
      featured
      createdAt
      updatedAt
    }
  }
`;

export const DESTINATION_BY_SLUG_QUERY = `
  query GetDestinationBySlug($slug: String!) {
    destinationBySlug(slug: $slug) {
      id
      name
      slug
      country {
        id
        name
        code
        continent
      }
      type
      season
      description
      highlights
      image
      gallery
      rating
      reviewCount
      priceFrom
      duration
      bestTime
      climate
      activities
      featured
      createdAt
      updatedAt
      tours {
        id
        title
        slug
        priceFrom
        duration
        rating
        reviewCount
        images
        featured
      }
    }
  }
`;

export const TOURS_QUERY = `
  query GetTours {
    tours {
      id
      title
      slug
      destination {
        id
        name
        country {
          id
          name
          code
          continent
        }
      }
      description
      highlights
      inclusions
      exclusions
      duration
      groupSizeMax
      difficulty
      priceFrom
      images
      featured
      status
      itinerary {
        id
        dayNumber
        title
        description
        activities
        meals
        accommodation
      }
      createdAt
      updatedAt
    }
  }
`;

export const BLOG_POSTS_QUERY = `
  query BlogPosts($status: PostStatus) {
    blogPosts(status: $status) {
      id
      title
      slug
      excerpt
      author {
        name
        email
      }
      publishedAt
      category {
        name
      }
      tags
      image
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

export const CREATE_DESTINATION_MUTATION = `
  mutation CreateDestination($input: CreateDestinationInput!) {
    createDestination(input: $input) {
      id
      name
      slug
      country {
        id
        name
        code
        continent
      }
      type
      season
      description
      highlights
      image
      gallery
      priceFrom
      duration
      bestTime
      climate
      activities
      featured
      createdAt
    }
  }
`;

export const UPDATE_DESTINATION_MUTATION = `
  mutation UpdateDestination($id: ID!, $input: UpdateDestinationInput!) {
    updateDestination(id: $id, input: $input) {
      id
      name
      slug
      country {
        id
        name
        code
        continent
      }
      type
      season
      description
      highlights
      image
      gallery
      priceFrom
      duration
      bestTime
      climate
      activities
      featured
      updatedAt
    }
  }
`;

export const DELETE_DESTINATION_MUTATION = `
  mutation DeleteDestination($id: ID!) {
    deleteDestination(id: $id)
  }
`;

// Tour Queries and Mutations
export const FEATURED_TOURS_QUERY = `
  query FeaturedTours {
    tours(featured: true) {
      id
      title
      slug
      destination {
        id
        name
        country {
          name
          code
        }
      }
      description
      highlights
      duration
      groupSizeMax
      priceFrom
      images
      featured
      reviews {
        id
        rating
        title
        content
        customer {
          firstName
          lastName
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const POPULAR_DESTINATIONS_QUERY = `
  query PopularDestinations {
    destinations {
      id
      name
      slug
      country {
        id
        name
        code
        continent
      }
      type
      image
      gallery
      rating
      reviewCount
      priceFrom
      duration
      featured
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TOUR_MUTATION = `
  mutation CreateTour($input: CreateTourInput!) {
    createTour(input: $input) {
      id
      title
      slug
      destination {
        id
        name
        country {
          id
          name
          code
          continent
        }
      }
      description
      highlights
      inclusions
      exclusions
      duration
      groupSizeMax
      difficulty
      priceFrom
      images
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TOUR_MUTATION = `
  mutation UpdateTour($id: ID!, $input: UpdateTourInput!) {
    updateTour(id: $id, input: $input) {
      id
      title
      slug
      destination {
        id
        name
        country {
          id
          name
          code
          continent
        }
      }
      description
      highlights
      inclusions
      exclusions
      duration
      groupSizeMax
      difficulty
      priceFrom
      images
      featured
      status
      updatedAt
    }
  }
`;

export const DELETE_TOUR_MUTATION = `
  mutation DeleteTour($id: ID!) {
    deleteTour(id: $id)
  }
`;

// Itinerary Management Mutations
export const CREATE_TOUR_ITINERARY_MUTATION = `
  mutation CreateTourItinerary($input: CreateTourItineraryInput!) {
    createTourItinerary(input: $input) {
      id
      dayNumber
      title
      description
      activities
      meals
      accommodation
    }
  }
`;

export const UPDATE_TOUR_ITINERARY_MUTATION = `
  mutation UpdateTourItinerary($id: ID!, $input: UpdateTourItineraryInput!) {
    updateTourItinerary(id: $id, input: $input) {
      id
      dayNumber
      title
      description
      activities
      meals
      accommodation
    }
  }
`;

export const DELETE_TOUR_ITINERARY_MUTATION = `
  mutation DeleteTourItinerary($id: ID!) {
    deleteTourItinerary(id: $id)
  }
`;

// Blog Posts Queries and Mutations
export const CREATE_BLOG_POST_MUTATION = `
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      slug
      status
    }
  }
`;

export const DELETE_BLOG_POST_MUTATION = `
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id)
  }
`;

// Bookings Queries and Mutations
export const BOOKINGS_QUERY = `
  query Bookings($status: BookingStatus) {
    bookings(status: $status) {
      id
      bookingReference
      tour {
        id
        title
        destination {
          name
          country {
            name
          }
        }
      }
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      startDate
      endDate
      adultsCount
      childrenCount
      totalPrice
      status
      paymentStatus
      specialRequests
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOKING_STATUS_MUTATION = `
  mutation UpdateBookingStatus($id: ID!, $status: BookingStatus!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// Booking Management Mutations
export const CREATE_BOOKING_MUTATION = `
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      bookingReference
      tour {
        id
        title
        destination {
          name
          country {
            name
          }
        }
      }
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      startDate
      endDate
      adultsCount
      childrenCount
      totalPrice
      status
      paymentStatus
      travelers {
        id
        firstName
        lastName
        age
        passportNumber
        dietaryRequirements
      }
      createdAt
    }
  }
`;

export const CANCEL_BOOKING_MUTATION = `
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const PAYSTACK_INITIALIZE_MUTATION = `
  mutation PaystackInitialize($input: PaystackInitializeInput!) {
    paystackInitialize(input: $input) {
      success
      message
      data {
        authorization_url
        access_code
        reference
      }
    }
  }
`;

export const PAYSTACK_VERIFY_MUTATION = `
  mutation PaystackVerify($reference: String!) {
    paystackVerify(reference: $reference) {
      success
      message
      data {
        reference
        amount
        status
        gateway_response
        paid_at
        created_at
        channel
        currency
        customer {
          id
          first_name
          last_name
          email
          phone
        }
      }
    }
  }
`;

// Customers Query (Note: This may need to be added to the backend schema)
export const CUSTOMERS_QUERY = `
  query Customers {
    customers {
      id
      email
      firstName
      lastName
      phone
      dateOfBirth
      nationality
      passportNumber
      emergencyContact
      dietaryRequirements
      medicalConditions
      createdAt
      updatedAt
    }
  }
`;

// Search Queries
export const SEARCH_TOURS_QUERY = `
  query SearchTours(
    $query: String
    $continent: String
    $country: String
    $destination: String
    $category: String
    $minPrice: Int
    $maxPrice: Int
    $duration: String
    $minRating: Float
    $features: [String]
    $season: String
    $startDate: String
    $endDate: String
    $adults: Int
    $children: Int
    $limit: Int
    $offset: Int
  ) {
    searchTours(
      query: $query
      continent: $continent
      country: $country
      destination: $destination
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
      duration: $duration
      minRating: $minRating
      features: $features
      season: $season
      startDate: $startDate
      endDate: $endDate
      adults: $adults
      children: $children
      limit: $limit
      offset: $offset
    ) {
      tours {
        id
        title
        slug
        destination {
          id
          name
          country {
            id
            name
            code
            continent
          }
        }
        description
        highlights
        inclusions
        exclusions
        duration
        groupSizeMax
        difficulty
        priceFrom
        images
        featured
        category
        features
        season
        rating
        reviewCount
        reviews {
          id
          rating
          title
          content
          customer {
            firstName
            lastName
          }
          createdAt
        }
        createdAt
        updatedAt
      }
      totalCount
      hasMore
    }
  }
`;

export const TOUR_BY_SLUG_QUERY = `
  query TourBySlug($slug: String!) {
    tourBySlug(slug: $slug) {
      id
      title
      slug
      destination {
        id
        name
        country {
          id
          name
          code
          continent
        }
      }
      description
      highlights
      inclusions
      exclusions
      duration
      groupSizeMax
      difficulty
      priceFrom
      images
      featured
      category
      features
      season
      rating
      reviewCount
      itinerary {
        id
        dayNumber
        title
        description
        activities
        meals
        accommodation
      }
      reviews {
        id
        rating
        content
        createdAt
        customer {
          firstName
          lastName
        }
        user {
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const TOUR_BY_ID_QUERY = `
  query TourById($id: ID!) {
    tour(id: $id) {
      id
      title
      slug
      destination {
        id
        name
        country {
          name
          code
        }
      }
      description
      highlights
      inclusions
      exclusions
      duration
      groupSizeMax
      difficulty
      priceFrom
      images
      featured
      category
      features
      season
      rating
      reviewCount
      itinerary {
        id
        dayNumber
        title
        description
        activities
        accommodation
        meals
      }
      pricing {
        id
        season
        priceAdult
        priceChild
        availableDates
        maxCapacity
      }
      reviews {
        id
        rating
        title
        content
        user {
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const TOUR_PRICING_QUERY = `
  query TourPricing($tourId: ID!) {
    tourPricing(tourId: $tourId) {
      id
      season
      priceAdult
      priceChild
      availableDates
      maxCapacity
    }
  }
`;

export const CREATE_TOUR_PRICING_MUTATION = `
  mutation CreateTourPricing($input: CreateTourPricingInput!) {
    createTourPricing(input: $input) {
      id
      season
      priceAdult
      priceChild
      availableDates
      maxCapacity
    }
  }
`;

export const UPDATE_TOUR_PRICING_MUTATION = `
  mutation UpdateTourPricing($id: ID!, $input: UpdateTourPricingInput!) {
    updateTourPricing(id: $id, input: $input) {
      id
      season
      priceAdult
      priceChild
      availableDates
      maxCapacity
    }
  }
`;

export const DELETE_TOUR_PRICING_MUTATION = `
  mutation DeleteTourPricing($id: ID!) {
    deleteTourPricing(id: $id)
  }
`;

export const SEARCH_DESTINATIONS_QUERY = `
  query SearchDestinations(
    $query: String
    $continent: String
    $country: String
    $type: String
    $minPrice: Int
    $maxPrice: Int
    $minRating: Float
    $season: String
    $limit: Int
    $offset: Int
  ) {
    searchDestinations(
      query: $query
      continent: $continent
      country: $country
      type: $type
      minPrice: $minPrice
      maxPrice: $maxPrice
      minRating: $minRating
      season: $season
      limit: $limit
      offset: $offset
    ) {
      destinations {
        id
        name
        slug
        country {
          id
          name
          code
          continent
        }
        type
        season
        description
        highlights
        image
        gallery
        rating
        reviewCount
        priceFrom
        duration
        bestTime
        climate
        activities
        featured
        createdAt
        updatedAt
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_SEARCH_FILTERS_QUERY = `
  query GetSearchFilters {
    searchFilters {
      continents
      countries {
        id
        name
        code
        continent
      }
      tourCategories
      tourFeatures
      destinationTypes
      seasons
      priceRanges {
        min
        max
        label
      }
      durationOptions
    }
  }
`;

// Media Upload Queries and Mutations
export const GENERATE_PRESIGNED_UPLOAD_URL_MUTATION = `
  mutation GeneratePresignedUploadUrl($input: GeneratePresignedUrlInput!) {
    generatePresignedUploadUrl(input: $input) {
      uploadUrl
      key
      publicUrl
    }
  }
`;

export const CREATE_MEDIA_FILE_MUTATION = `
  mutation CreateMediaFile($input: CreateMediaFileInput!) {
    createMediaFile(input: $input) {
      id
      filename
      originalName
      url
      key
      size
      contentType
      folder
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_MEDIA_FILE_MUTATION = `
  mutation DeleteMediaFile($id: ID!) {
    deleteMediaFile(id: $id)
  }
`;

export const SERVER_UPLOAD_FILE_MUTATION = `
  mutation ServerUploadFile($input: ServerUploadInput!) {
    serverUploadFile(input: $input) {
      id
      filename
      originalName
      url
      key
      size
      contentType
      folder
      createdAt
      updatedAt
    }
  }
`;

export const MEDIA_FILES_QUERY = `
  query GetMediaFiles {
    mediaFiles {
      id
      filename
      originalName
      url
      key
      size
      contentType
      folder
      createdAt
      updatedAt
    }
  }
`;

// Helper functions
export const formatPrice = (priceInUsd: number): string => {
  return `$${priceInUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// All prices are now handled in USD by default, converted to cedis only for payment processing
