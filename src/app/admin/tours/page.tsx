'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Route,
  Grid,
  List,
  MoreVertical,
  TrendingUp,
  Clock,
  DollarSign,
  Globe,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Archive,
  Loader2
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AddTourModal from '@/components/admin/AddTourModal';
import ViewTourModal from '@/components/admin/ViewTourModal';
import EditTourModal from '@/components/admin/EditTourModal';
import ItineraryManagementModal from '@/components/admin/ItineraryManagementModal';
import TourPricingModal from '@/components/admin/TourPricingModal';
import { graphqlClient, TOURS_QUERY, DELETE_TOUR_MUTATION } from '@/lib/graphql-client';

interface Tour {
  id: string;
  title: string;
  slug: string;
  destination: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      code: string;
      continent: string;
    };
  };
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  duration: number;
  groupSizeMax: number;
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXTREME';
  priceFrom: number;
  images: string[];
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  itinerary?: Array<{
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
  const [isViewTourModalOpen, setIsViewTourModalOpen] = useState(false);
  const [isEditTourModalOpen, setIsEditTourModalOpen] = useState(false);
  const [isItineraryManagementModalOpen, setIsItineraryManagementModalOpen] = useState(false);
  const [isTourPricingModalOpen, setIsTourPricingModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Set auth token in GraphQL client
    graphqlClient.setAuthToken(token);
    
    // Load tours from backend
    loadTours();
  }, [router]);

  const loadTours = async () => {
    try {
      setIsLoading(true);
      const result = await graphqlClient.request(TOURS_QUERY);
      setTours(result.tours || []);
    } catch (error) {
      console.error('Error loading tours:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (tour: Tour) => {
    setSelectedTour(tour);
    setIsViewTourModalOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditTourModalOpen(true);
  };

  const handleItinerary = (tour: Tour) => {
    setSelectedTour(tour);
    setIsItineraryManagementModalOpen(true);
  };

  const handlePricing = (tour: Tour) => {
    setSelectedTour(tour);
    setIsTourPricingModalOpen(true);
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(tourId);
      await graphqlClient.request(DELETE_TOUR_MUTATION, { id: tourId });
      
      // Remove from local state
      setTours(prev => prev.filter(t => t.id !== tourId));
      
      // Show success message (you could add a toast notification here)
      console.log('Tour deleted successfully');
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Failed to delete tour. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseModals = () => {
    setIsViewTourModalOpen(false);
    setIsEditTourModalOpen(false);
    setIsItineraryManagementModalOpen(false);
    setIsTourPricingModalOpen(false);
    setSelectedTour(null);
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || tour.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MODERATE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CHALLENGING': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'EXTREME': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT': return <AlertCircle className="w-4 h-4" />;
      case 'ARCHIVED': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatPrice = (priceInPesewas: number): string => {
    const cedis = priceInPesewas / 100;
    return `GH₵ ${cedis.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const stats = {
    total: tours.length,
    published: tours.filter(t => t.status === 'PUBLISHED').length,
    draft: tours.filter(t => t.status === 'DRAFT').length,
    featured: tours.filter(t => t.featured).length
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading tours...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Tours Management
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Create and manage your African adventure tours
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAddTourModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Tour
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Modern Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tours</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.published}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.draft}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Edit className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modern Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tours, destinations, countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MODERATE">Moderate</option>
                        <option value="CHALLENGING">Challenging</option>
                        <option value="EXTREME">Extreme</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setDifficultyFilter('all');
                          setSearchTerm('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tours Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredTours.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || difficultyFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by creating your first tour.'}
                </p>
                <button
                  onClick={() => setIsAddTourModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Tour
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Tour Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                      {tour.images && tour.images.length > 0 && tour.images[0] !== '/api/placeholder/600/400' ? (
                        <img
                          src={tour.images[0]}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {tour.featured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tour.status)}`}>
                        {getStatusIcon(tour.status)}
                        <span className="ml-1 capitalize">{tour.status.toLowerCase()}</span>
                      </div>
                    </div>

                    {/* Tour Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
                            {tour.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{tour.destination.name}, {tour.destination.country.name}</span>
                          </div>
                        </div>
                        
                        {/* Actions Dropdown */}
                        <div className="relative group/menu">
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                            <div className="py-2">
                              <button
                                onClick={() => handleView(tour)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(tour)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4 mr-3" />
                                Edit Tour
                              </button>
                              <button
                                onClick={() => handleItinerary(tour)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Calendar className="w-4 h-4 mr-3" />
                                Manage Itinerary
                              </button>
                              <button
                                onClick={() => handlePricing(tour)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <DollarSign className="w-4 h-4 mr-3" />
                                Manage Pricing
                              </button>
                              <button
                                onClick={() => handleDelete(tour.id)}
                                disabled={deleteLoading === tour.id}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                              >
                                {deleteLoading === tour.id ? (
                                  <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-3" />
                                )}
                                Delete Tour
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tour.description}
                      </p>

                      {/* Tour Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-primary-500" />
                          <span>{tour.duration} days</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-primary-500" />
                          <span>Max {tour.groupSizeMax}</span>
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(tour.difficulty)}`}>
                          {tour.difficulty}
                        </span>
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(tour.priceFrom)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(tour)}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(tour)}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleItinerary(tour)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Itinerary
                        </button>
                        <button
                          onClick={() => handlePricing(tour)}
                          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Pricing
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {isAddTourModalOpen && (
        <AddTourModal
          isOpen={isAddTourModalOpen}
          onClose={() => setIsAddTourModalOpen(false)}
          onTourAdded={loadTours}
        />
      )}

      {isViewTourModalOpen && selectedTour && (
        <ViewTourModal
          isOpen={isViewTourModalOpen}
          onClose={handleCloseModals}
          tour={selectedTour}
        />
      )}

      {isEditTourModalOpen && selectedTour && (
        <EditTourModal
          isOpen={isEditTourModalOpen}
          onClose={handleCloseModals}
          tour={selectedTour}
          onTourUpdated={loadTours}
        />
      )}

      {isItineraryManagementModalOpen && selectedTour && (
        <ItineraryManagementModal
          isOpen={isItineraryManagementModalOpen}
          onClose={() => setIsItineraryManagementModalOpen(false)}
          tour={selectedTour}
          onItineraryUpdated={loadTours}
        />
      )}

      {isTourPricingModalOpen && selectedTour && (
        <TourPricingModal
          isOpen={isTourPricingModalOpen}
          onClose={() => setIsTourPricingModalOpen(false)}
          tourId={selectedTour.id}
          tourTitle={selectedTour.title}
          onPricingUpdated={loadTours}
        />
      )}
    </AdminLayout>
  );
}
