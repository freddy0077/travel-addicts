'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Star, 
  DollarSign, 
  Filter, 
  Calendar, 
  Eye,
  Grid,
  List,
  MoreVertical,
  Globe,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Archive,
  Loader2,
  Clock,
  Users,
  Camera,
  TrendingUp,
  Mountain,
  Waves,
  Building,
  TreePine,
  Sun,
  Snowflake
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AddDestinationModal from '@/components/admin/AddDestinationModal';
import ViewDestinationModal from '@/components/admin/ViewDestinationModal';
import EditDestinationModal from '@/components/admin/EditDestinationModal';
import { graphqlClient, DESTINATIONS_QUERY, DELETE_DESTINATION_MUTATION, formatPrice } from '@/lib/graphql-client';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  gallery?: string[];
  priceFrom: number;
  featured: boolean;
  type: string;
  season: string;
  duration: string;
  bestTime: string;
  climate: string;
  activities: string[];
  highlights: string[];
  country: {
    id: string;
    name: string;
    code: string;
    continent: string;
  };
  createdAt: string;
  updatedAt: string;
  tourCount?: number;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContinent, setFilterContinent] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
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
    
    // Load destinations from backend
    loadDestinations();
  }, [router]);

  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      const result = await graphqlClient.request(DESTINATIONS_QUERY);
      setDestinations(result.destinations || []);
    } catch (error) {
      console.error('Error loading destinations:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowViewModal(true);
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowEditModal(true);
  };

  const handleDelete = async (destinationId: string) => {
    if (!confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(destinationId);
      await graphqlClient.request(DELETE_DESTINATION_MUTATION, { id: destinationId });
      
      // Remove from local state
      setDestinations(prev => prev.filter(d => d.id !== destinationId));
      
      console.log('Destination deleted successfully');
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Failed to delete destination. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedDestination(null);
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = !filterContinent || destination.country.continent === filterContinent;
    const matchesType = !filterType || destination.type === filterType;
    
    return matchesSearch && matchesContinent && matchesType;
  });

  const getTypeIcon = (type: string) => {
    const iconProps = "w-4 h-4";
    switch (type.toLowerCase()) {
      case 'mountains': return <Mountain className={iconProps} />;
      case 'islands': return <Waves className={iconProps} />;
      case 'cultural': return <Building className={iconProps} />;
      case 'safari': return <TreePine className={iconProps} />;
      case 'tropical': return <Sun className={iconProps} />;
      case 'city': return <Building className={iconProps} />;
      default: return <MapPin className={iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mountains': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'islands': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cultural': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'safari': return 'bg-green-100 text-green-700 border-green-200';
      case 'tropical': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'city': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Map African destinations to our hero images
  const getAfricanHeroImage = (destinationName: string, fallbackImage: string) => {
    const imageMap: { [key: string]: string } = {
      'serengeti': '/images/destinations/serengeti-migration.jpg',
      'kilimanjaro': '/images/destinations/kilimanjaro-sunrise.jpg',
      'victoria falls': '/images/destinations/victoria-falls.jpg',
      'zanzibar': '/images/destinations/zanzibar-beach.jpg',
      'cape town': '/images/destinations/cape-town-table-mountain.jpg',
      'masai mara': '/images/destinations/masai-mara-balloon.jpg',
      'kruger': '/images/destinations/kruger-national-park.jpg',
      'sossusvlei': '/images/destinations/sossusvlei-dunes.jpg',
      'sahara': '/images/destinations/sahara-desert-morocco.jpg',
      'pyramids': '/images/destinations/pyramids-giza-egypt.jpg'
    };

    const lowerName = destinationName.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (lowerName.includes(key)) {
        return image;
      }
    }

    // If no match found, return fallback or a random African image
    if (fallbackImage && !fallbackImage.includes('placeholder')) {
      return fallbackImage;
    }
    
    // Return a random African destination image as fallback
    const randomImages = Object.values(imageMap);
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  const stats = {
    total: destinations.length,
    featured: destinations.filter(d => d.featured).length,
    africa: destinations.filter(d => d.country.continent === 'Africa').length,
    types: [...new Set(destinations.map(d => d.type))].length
  };

  const continents = [...new Set(destinations.map(d => d.country.continent))];
  const types = [...new Set(destinations.map(d => d.type))];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading destinations...</p>
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
                  Destinations Management
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Discover and manage Africa's most beautiful destinations
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-primary-700 hover:to-primary-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Destination
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
                  <p className="text-sm font-medium text-gray-600">Total Destinations</p>
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
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">African Destinations</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.africa}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Destination Types</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.types}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Camera className="w-6 h-6 text-amber-600" />
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
                  placeholder="Search destinations, countries, descriptions..."
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
                      <select
                        value={filterContinent}
                        onChange={(e) => setFilterContinent(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">All Continents</option>
                        {continents.map(continent => (
                          <option key={continent} value={continent}>{continent}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">All Types</option>
                        {types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setFilterContinent('');
                          setFilterType('');
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

          {/* Destinations Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredDestinations.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterContinent || filterType
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by creating your first destination.'}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Destination
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredDestinations.map((destination, index) => {
                  const heroImage = getAfricanHeroImage(destination.name, destination.image);
                  
                  return (
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Destination Image */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                        {heroImage ? (
                          <img
                            src={heroImage}
                            alt={`${destination.name} - ${destination.country.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {destination.featured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(destination.type)}`}>
                          {getTypeIcon(destination.type)}
                          <span className="ml-1 capitalize">{destination.type}</span>
                        </div>
                      </div>

                      {/* Destination Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
                              {destination.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{destination.country.name}, {destination.country.continent}</span>
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
                                  onClick={() => handleView(destination)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <Eye className="w-4 h-4 mr-3" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEdit(destination)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <Edit className="w-4 h-4 mr-3" />
                                  Edit Destination
                                </button>
                                <button
                                  onClick={() => handleDelete(destination.id)}
                                  disabled={deleteLoading === destination.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                >
                                  {deleteLoading === destination.id ? (
                                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 mr-3" />
                                  )}
                                  Delete Destination
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {destination.description}
                        </p>

                        {/* Destination Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-primary-500" />
                            <span>{destination.duration}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                            <span>{destination.bestTime}</span>
                          </div>
                        </div>

                        {/* Price and Activities */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-primary-600">
                            {formatPrice(destination.priceFrom)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {destination.activities?.length || 0} activities
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(destination)}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(destination)}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <AddDestinationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onDestinationAdded={loadDestinations}
        />
      )}

      {showViewModal && selectedDestination && (
        <ViewDestinationModal
          isOpen={showViewModal}
          onClose={handleCloseModals}
          destination={selectedDestination}
        />
      )}

      {showEditModal && selectedDestination && (
        <EditDestinationModal
          isOpen={showEditModal}
          onClose={handleCloseModals}
          destination={selectedDestination}
          onDestinationUpdated={loadDestinations}
        />
      )}
    </AdminLayout>
  );
}
