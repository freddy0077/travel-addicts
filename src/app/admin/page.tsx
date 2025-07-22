'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Globe,
  BookOpen,
  CreditCard,
  Activity,
  Star,
  Clock,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { graphqlClient, formatPrice } from '@/lib/graphql-client';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalDestinations: number;
  totalCustomers: number;
  totalTours: number;
  totalBlogPosts: number;
  monthlyGrowth: {
    bookings: number;
    revenue: number;
    customers: number;
  };
  conversionRate: number;
  averageBookingValue: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'destination' | 'blog' | 'customer';
  title: string;
  subtitle: string;
  time: string;
  status?: string;
  amount?: number;
}

interface TopDestination {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  growth: number;
}

const DASHBOARD_QUERY = `
  query GetDashboardData {
    analytics {
      totalBookings
      totalRevenue
      totalCustomers
      conversionRate
      averageBookingValue
      monthlyGrowth {
        bookings
        revenue
        customers
      }
      popularDestinations {
        id
        name
        bookings
        revenue
        growth
      }
      recentBookings {
        id
        customerName
        tour {
          id
          title
        }
        createdAt
        status
        totalPrice
      }
      monthlyStats {
        month
        bookings
        revenue
        customers
      }
      topPerformingTours {
        id
        title
        bookings
        revenue
        averageRating
      }
      customerInsights {
        totalCustomers
        newCustomersThisMonth
        returningCustomers
        averageCustomerValue
        topNationalities {
          nationality
          count
          percentage
        }
      }
    }
    destinations {
      id
      name
    }
    tours {
      id
      title
    }
    blogPosts {
      id
      title
    }
  }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalDestinations: 0,
    totalCustomers: 0,
    totalTours: 0,
    totalBlogPosts: 0,
    monthlyGrowth: {
      bookings: 0,
      revenue: 0,
      customers: 0
    },
    conversionRate: 0,
    averageBookingValue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topDestinations, setTopDestinations] = useState<TopDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Load dashboard data
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Set auth token for GraphQL requests
      const token = localStorage.getItem('adminToken');
      if (token) {
        graphqlClient.setAuthToken(token);
      }
      
      // Fetch real data from GraphQL API
      const result = await graphqlClient.request(DASHBOARD_QUERY);
      
      if (result && result.analytics) {
        const analytics = result.analytics;
        
        // Use real analytics data
        setStats({
          totalBookings: analytics.totalBookings || 0,
          totalRevenue: analytics.totalRevenue || 0,
          totalDestinations: result.destinations?.length || 0,
          totalCustomers: analytics.totalCustomers || 0,
          totalTours: result.tours?.length || 0,
          totalBlogPosts: result.blogPosts?.length || 0,
          monthlyGrowth: {
            bookings: analytics.monthlyGrowth.bookings || 0,
            revenue: analytics.monthlyGrowth.revenue || 0,
            customers: analytics.monthlyGrowth.customers || 0
          },
          conversionRate: analytics.conversionRate || 0,
          averageBookingValue: analytics.averageBookingValue || 0
        });

        // Convert real recent bookings to activity format
        const recentBookingsActivity = analytics.recentBookings?.slice(0, 5).map((booking: any, index: number) => ({
          id: booking.id,
          type: 'booking' as const,
          title: `New booking ${booking.status.toLowerCase()}`,
          subtitle: `${booking.tour?.title} - ${booking.customerName}`,
          time: formatTimeAgo(booking.createdAt),
          status: booking.status.toLowerCase(),
          amount: booking.totalPrice / 100 // Convert from pesewas to cedis
        })) || [];

        setRecentActivity(recentBookingsActivity);

        // Use real popular destinations data
        const topDestinationsData = analytics.popularDestinations?.slice(0, 5).map((dest: any) => ({
          id: dest.id,
          name: dest.name,
          bookings: dest.bookings,
          revenue: dest.revenue / 100, // Convert from pesewas to cedis
          growth: dest.growth
        })) || [];

        setTopDestinations(topDestinationsData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Only show error, don't fall back to mock data
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        totalDestinations: 0,
        totalCustomers: 0,
        totalTours: 0,
        totalBlogPosts: 0,
        monthlyGrowth: {
          bookings: 0,
          revenue: 0,
          customers: 0
        },
        conversionRate: 0,
        averageBookingValue: 0
      });
      setRecentActivity([]);
      setTopDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'customer': return Users;
      case 'destination': return MapPin;
      case 'blog': return BookOpen;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-green-600 bg-green-100';
      case 'customer': return 'text-blue-600 bg-blue-100';
      case 'destination': return 'text-purple-600 bg-purple-100';
      case 'blog': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-neutral-600 ml-14">Welcome back! Here's what's happening with your travel business.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{stats.monthlyGrowth.revenue}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {formatPrice(stats.totalRevenue)}
              </h3>
              <p className="text-neutral-600 text-sm">Total Revenue</p>
            </div>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{stats.monthlyGrowth.bookings}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {stats.totalBookings.toLocaleString()}
              </h3>
              <p className="text-neutral-600 text-sm">Total Bookings</p>
            </div>
          </motion.div>

          {/* Total Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{stats.monthlyGrowth.customers}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {stats.totalCustomers.toLocaleString()}
              </h3>
              <p className="text-neutral-600 text-sm">Total Customers</p>
            </div>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+2.1%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {stats.conversionRate}%
              </h3>
              <p className="text-neutral-600 text-sm">Conversion Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{stats.totalDestinations}</h3>
                  <p className="text-neutral-600 text-sm">Active Destinations</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/10 to-primary-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{stats.totalTours}</h3>
                  <p className="text-neutral-600 text-sm">Available Tours</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{formatPrice(stats.averageBookingValue)}</h3>
                  <p className="text-neutral-600 text-sm">Avg. Booking Value</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Recent Activity</h2>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                    >
                      <div className={`p-2 rounded-xl ${getActivityColor(activity.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">{activity.title}</p>
                        <p className="text-sm text-neutral-600 truncate">{activity.subtitle}</p>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="font-semibold text-green-600">{formatPrice(activity.amount)}</p>
                        )}
                        <p className="text-xs text-neutral-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Top Destinations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/5 to-primary-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">Top Destinations</h2>
              </div>
              <div className="space-y-4">
                {topDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-900">{destination.name}</h3>
                      <div className="flex items-center space-x-1 text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        <span className="text-xs font-semibold">+{destination.growth}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{destination.bookings} bookings</span>
                      <span className="font-semibold text-neutral-900">{formatPrice(destination.revenue)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
