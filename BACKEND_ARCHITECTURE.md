# Travel Addict Backend Architecture Plan

## 🎯 Overview

This document outlines the comprehensive backend architecture for the Travel Addict luxury travel booking platform. The backend will support both the public website and admin dashboard through a unified GraphQL API with robust data persistence, authentication, and business logic.

## 🏗️ Architecture Stack

### **Core Technologies**
- **Database**: PostgreSQL with Prisma ORM
- **API Layer**: GraphQL with GraphQL Yoga
- **Authentication**: NextAuth.js with JWT
- **File Storage**: AWS S3 or Cloudinary for images
- **Email Service**: SendGrid or Resend
- **Payment Processing**: Paystack Accept API (GHS - Ghanaian Cedi)
- **Caching**: Redis (optional for performance)
- **Deployment**: Vercel with PostgreSQL (Neon/Supabase)

### **Why This Stack?**
- **PostgreSQL**: Robust relational database perfect for complex travel data relationships
- **Prisma**: Type-safe ORM with excellent TypeScript integration
- **GraphQL**: Flexible API that matches our admin dashboard needs
- **NextAuth.js**: Seamless authentication for Next.js applications
- **Paystack**: Industry-standard payment processing for bookings
- **Stripe**: Industry-standard payment processing for bookings

## 📊 Database Schema Design

### **Core Entities & Relationships**

```sql
-- Users & Authentication
Users (id, email, name, role, password_hash, created_at, updated_at)
UserSessions (id, user_id, token, expires_at)

-- Geographic & Destination Data
Countries (id, name, code, continent)
Destinations (id, name, country_id, type, season, description, highlights[], 
             image_url, gallery[], rating, review_count, price_from, 
             duration, best_time, climate, activities[], featured, 
             created_at, updated_at)

-- Tour & Package Management
Tours (id, title, slug, destination_id, description, highlights[], 
       inclusions[], exclusions[], duration_days, group_size_max, 
       difficulty_level, price_from, images[], featured, status, 
       created_at, updated_at)

TourItineraries (id, tour_id, day_number, title, description, 
                meals[], accommodation, activities[])

TourPricing (id, tour_id, season, price_adult, price_child, 
            available_dates[], max_capacity)

-- Content Management
BlogPosts (id, title, slug, excerpt, content, author_id, 
          published_at, category, tags[], image_url, featured, 
          status, seo_title, seo_description, created_at, updated_at)

BlogCategories (id, name, slug, description)

-- Booking & Customer Management
Customers (id, email, first_name, last_name, phone, date_of_birth, 
          nationality, passport_number, emergency_contact, 
          dietary_requirements, medical_conditions, created_at, updated_at)

Bookings (id, tour_id, customer_id, booking_reference, start_date, 
         end_date, adults_count, children_count, total_price, 
         status, payment_status, special_requests, created_at, updated_at)

BookingTravelers (id, booking_id, first_name, last_name, age, 
                 passport_number, dietary_requirements)

-- Payment & Financial
Payments (id, booking_id, stripe_payment_intent_id, amount, 
         currency, status, payment_method, created_at, updated_at)

-- Media & Assets
MediaFiles (id, filename, original_name, file_path, file_size, 
           mime_type, alt_text, created_by, created_at)

-- Reviews & Ratings
Reviews (id, tour_id, customer_id, rating, title, content, 
        verified_booking, status, created_at, updated_at)

-- System & Configuration
SiteSettings (id, key, value, type, description, updated_at)
EmailTemplates (id, name, subject, html_content, text_content, variables[])
```

### **Key Relationships**
- **Destinations** → **Tours** (One-to-Many)
- **Tours** → **TourItineraries** (One-to-Many)
- **Tours** → **Bookings** (One-to-Many)
- **Customers** → **Bookings** (One-to-Many)
- **Bookings** → **BookingTravelers** (One-to-Many)
- **Bookings** → **Payments** (One-to-Many)
- **Users** → **BlogPosts** (One-to-Many)

## 🔐 Authentication & Authorization

### **User Roles & Permissions**
```typescript
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',      // Full system access
  CONTENT_MANAGER = 'CONTENT_MANAGER', // Destinations, Tours, Blog
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE', // Bookings, Customers
  MARKETING = 'MARKETING',          // Blog, Analytics, SEO
  EDITOR = 'EDITOR',               // Content review and approval
  CUSTOMER = 'CUSTOMER'            // Public user account
}
```

### **Permission Matrix**
| Resource | Super Admin | Content Manager | Customer Service | Marketing | Editor | Customer |
|----------|-------------|-----------------|------------------|-----------|--------|----------|
| Users | CRUD | - | - | - | - | - |
| Destinations | CRUD | CRUD | R | R | R | R |
| Tours | CRUD | CRUD | R | R | R | R |
| Blog Posts | CRUD | CRUD | - | CRUD | RU | R |
| Bookings | CRUD | R | CRUD | R | - | R (own) |
| Customers | CRUD | R | CRUD | R | - | RU (own) |
| Analytics | R | R | R | R | - | - |
| Settings | CRUD | - | - | - | - | - |

### **Authentication Flow**
1. **Admin Login**: JWT tokens with role-based permissions
2. **Customer Registration**: Email verification + profile creation
3. **Session Management**: Secure token refresh and expiration
4. **Password Security**: bcrypt hashing with salt rounds

## 🚀 GraphQL Schema Architecture

### **Modular Schema Structure**
```
/src/graphql/
├── schema/
│   ├── user.graphql
│   ├── destination.graphql
│   ├── tour.graphql
│   ├── blog.graphql
│   ├── booking.graphql
│   ├── payment.graphql
│   └── analytics.graphql
├── resolvers/
│   ├── user.ts
│   ├── destination.ts
│   ├── tour.ts
│   ├── blog.ts
│   ├── booking.ts
│   ├── payment.ts
│   └── analytics.ts
├── middleware/
│   ├── auth.ts
│   ├── permissions.ts
│   └── validation.ts
└── utils/
    ├── context.ts
    ├── errors.ts
    └── scalars.ts
```

### **Enhanced GraphQL Features**
- **Subscriptions**: Real-time booking notifications
- **File Uploads**: Image and document handling
- **Pagination**: Cursor-based pagination for large datasets
- **Filtering**: Advanced search and filter capabilities
- **Caching**: Query result caching for performance
- **Rate Limiting**: API protection against abuse

## 💾 Data Layer Implementation

### **Prisma Schema Structure**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(CUSTOMER)
  password  String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  blogPosts BlogPost[]
  bookings  Booking[]
  reviews   Review[]
  
  @@map("users")
}

model Destination {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  country     String
  continent   String
  type        String
  season      String
  description String
  highlights  String[]
  image       String
  gallery     String[]
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  priceFrom   Int
  duration    String
  bestTime    String
  climate     String
  activities  String[]
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tours Tour[]
  
  @@map("destinations")
}

// ... Additional models
```

### **Database Migrations Strategy**
- **Version Control**: All migrations tracked in Git
- **Rollback Support**: Safe migration rollback procedures
- **Seeding**: Development and production data seeding
- **Backup Strategy**: Automated daily backups

## 🔄 Business Logic Layer

### **Service Architecture**
```typescript
// /src/services/
├── AuthService.ts          // Authentication & authorization
├── DestinationService.ts   // Destination management
├── TourService.ts          // Tour & itinerary management
├── BookingService.ts       // Booking workflow & validation
├── PaymentService.ts       // Payment processing with Paystack
├── EmailService.ts         // Email notifications & templates
├── MediaService.ts         // File upload & management
├── AnalyticsService.ts     // Business intelligence & reporting
└── NotificationService.ts  // Real-time notifications
```

### **Key Business Rules**
- **Booking Validation**: Date availability, capacity limits, pricing rules
- **Payment Processing**: Secure payment flow with Paystack integration
- **Email Automation**: Booking confirmations, reminders, updates
- **Inventory Management**: Tour availability and capacity tracking
- **Price Calculation**: Dynamic pricing based on season, group size
- **Cancellation Policy**: Automated refund processing

## 📧 Communication & Notifications

### **Email Templates**
- **Booking Confirmation**: Detailed itinerary and payment receipt
- **Payment Reminders**: Automated payment due notifications
- **Trip Reminders**: Pre-departure information and checklists
- **Admin Notifications**: New bookings, cancellations, system alerts
- **Marketing Emails**: Newsletter, promotions, travel tips

### **Real-time Features**
- **Admin Dashboard**: Live booking notifications
- **Customer Portal**: Booking status updates
- **Payment Status**: Real-time payment confirmation
- **System Monitoring**: Error alerts and performance metrics

## 💳 Payment Integration

### **Paystack Accept API Implementation**
```typescript
// PaymentService.ts
import { PaystackApi } from 'paystack-node';

class PaymentService {
  private paystack: PaystackApi;
  
  constructor() {
    this.paystack = new PaystackApi(process.env.PAYSTACK_SECRET_KEY);
  }

  async initializePayment(booking: Booking) {
    const response = await this.paystack.transaction.initialize({
      email: booking.customer.email,
      amount: booking.totalPrice * 100, // Convert to kobo
      currency: 'GHS',
      reference: booking.bookingReference,
      callback_url: `${process.env.SITE_URL}/booking/confirm`,
      metadata: {
        booking_id: booking.id,
        tour_name: booking.tour.title,
        customer_name: booking.customer.name,
        travelers_count: booking.adultsCount + booking.childrenCount
      },
      channels: ['card', 'mobile_money', 'bank_transfer', 'ussd'],
      split_code: process.env.PAYSTACK_SPLIT_CODE // For commission splits
    });
    
    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await this.paystack.transaction.verify(reference);
    return response.data;
  }

  async processRefund(transactionId: string, amount?: number) {
    const response = await this.paystack.refund.create({
      transaction: transactionId,
      amount: amount ? amount * 100 : undefined, // Partial or full refund
      currency: 'GHS'
    });
    
    return response.data;
  }
}
```

### **Ghana-Specific Payment Methods**
```typescript
// Mobile Money Providers
const MOBILE_MONEY_PROVIDERS = {
  MTN: 'mtn',
  VODAFONE: 'vod',
  AIRTELTIGO: 'tgo'
};

// Bank Codes for Direct Bank Transfer
const GHANA_BANK_CODES = {
  GCB: '040',
  ECOBANK: '130',
  STANBIC: '190',
  FIDELITY: '240',
  REPUBLIC: '270',
  UMB: '340'
};

// USSD Codes for Quick Payments
const USSD_CODES = {
  MTN: '*170#',
  VODAFONE: '*110#',
  AIRTELTIGO: '*185#'
};
```

## 📊 Analytics & Reporting

### **Key Metrics Tracking**
- **Booking Analytics**: Conversion rates, popular destinations
- **Revenue Tracking**: Monthly/yearly revenue trends
- **Customer Analytics**: Demographics, behavior patterns
- **Content Performance**: Blog engagement, SEO metrics
- **Operational Metrics**: System performance, error rates

### **Reporting Features**
- **Dashboard Widgets**: Real-time KPI displays
- **Export Capabilities**: CSV/PDF report generation
- **Custom Date Ranges**: Flexible reporting periods
- **Automated Reports**: Scheduled email reports

## 🔒 Security & Compliance

### **Security Measures**
- **Data Encryption**: At-rest and in-transit encryption
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries via Prisma
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure configuration management

### **Compliance Requirements**
- **GDPR Compliance**: Data privacy and user rights
- **PCI DSS**: Payment card data security
- **Data Retention**: Automated data cleanup policies
- **Audit Logging**: Comprehensive activity tracking

## 🚀 Deployment & Infrastructure

### **Production Environment**
- **Database**: PostgreSQL on Neon/Supabase
- **Application**: Vercel deployment
- **File Storage**: AWS S3 or Cloudinary
- **Email Service**: SendGrid/Resend
- **Monitoring**: Vercel Analytics + Sentry
- **CDN**: Vercel Edge Network

### **Development Workflow**
- **Local Development**: Docker Compose setup
- **Staging Environment**: Preview deployments
- **CI/CD Pipeline**: Automated testing and deployment
- **Database Migrations**: Automated migration deployment

## 📈 Performance Optimization

### **Caching Strategy**
- **Query Caching**: GraphQL query result caching
- **Image Optimization**: Next.js Image component + CDN
- **Database Indexing**: Optimized database queries
- **API Response Caching**: Redis-based caching layer

### **Scalability Considerations**
- **Database Connection Pooling**: Efficient connection management
- **Horizontal Scaling**: Stateless application design
- **Background Jobs**: Queue-based processing for heavy tasks
- **CDN Integration**: Global content delivery

## 🧪 Testing Strategy

### **Testing Pyramid**
- **Unit Tests**: Service layer and utility functions
- **Integration Tests**: GraphQL resolvers and database operations
- **E2E Tests**: Critical user journeys (booking flow)
- **Performance Tests**: Load testing for peak usage

### **Quality Assurance**
- **Code Coverage**: Minimum 80% coverage requirement
- **Type Safety**: Full TypeScript implementation
- **Linting**: ESLint + Prettier for code consistency
- **Security Scanning**: Automated vulnerability detection

## 📋 Implementation Phases

### **Phase 1: Core Infrastructure (Week 1-2)**
- [ ] Set up PostgreSQL database with Prisma
- [ ] Implement authentication system with NextAuth.js
- [ ] Create core GraphQL schema and resolvers
- [ ] Set up basic CRUD operations for all entities

### **Phase 2: Business Logic (Week 3-4)**
- [ ] Implement booking workflow and validation
- [ ] Integrate Paystack payment processing
- [ ] Set up email service and templates
- [ ] Create file upload and media management

### **Phase 3: Advanced Features (Week 5-6)**
- [ ] Add real-time notifications and subscriptions
- [ ] Implement analytics and reporting
- [ ] Set up caching and performance optimization
- [ ] Create comprehensive admin dashboard integration

### **Phase 4: Testing & Deployment (Week 7-8)**
- [ ] Comprehensive testing suite
- [ ] Production deployment setup
- [ ] Performance optimization and monitoring
- [ ] Documentation and training materials

## 🎯 Success Metrics

### **Technical KPIs**
- **API Response Time**: < 200ms for 95% of requests
- **Database Query Performance**: < 100ms average query time
- **Uptime**: 99.9% availability
- **Error Rate**: < 0.1% of requests

### **Business KPIs**
- **Booking Conversion**: Track conversion from browse to booking
- **Payment Success Rate**: > 99% successful payments
- **Customer Satisfaction**: Automated feedback collection
- **Admin Efficiency**: Reduce content management time by 70%

---

## 🚀 Next Steps

1. **Review and approve this backend architecture plan**
2. **Set up development environment with PostgreSQL and Prisma**
3. **Begin Phase 1 implementation with core infrastructure**
4. **Establish CI/CD pipeline and testing framework**

This backend architecture will provide a robust, scalable foundation for the Travel Addict platform, supporting both current needs and future growth while maintaining security, performance, and maintainability standards.
