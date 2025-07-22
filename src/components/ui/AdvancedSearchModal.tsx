'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  Filter,
  Mountain,
  Waves,
  Building,
  TreePine,
  Sun,
  Snowflake,
  Compass,
  Camera,
  Heart,
  Plane,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchFilters, SearchFilters } from '@/hooks/useSearch';
import DestinationAutocomplete from './DestinationAutocomplete';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

export default function AdvancedSearchModal({ 
  isOpen, 
  onClose, 
  onSearch,
  initialFilters = {}
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    continent: undefined,
    country: undefined,
    destination: undefined,
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    duration: undefined,
    minRating: undefined,
    features: [],
    season: undefined,
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    ...initialFilters
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = filters.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    updateFilter('features', updatedFeatures);
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      continent: undefined,
      country: undefined,
      destination: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      duration: undefined,
      minRating: undefined,
      features: [],
      season: undefined,
      startDate: '',
      endDate: '',
      adults: 2,
      children: 0
    });
  };

  // Filter options
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  const categories = [
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'cultural', name: 'Cultural', icon: Building },
    { id: 'beach', name: 'Beach', icon: Waves },
    { id: 'nature', name: 'Nature', icon: TreePine },
    { id: 'city', name: 'City', icon: Building },
    { id: 'photography', name: 'Photography', icon: Camera }
  ];
  const durations = ['1-3 days', '4-7 days', '1-2 weeks', '2+ weeks'];
  const seasons = [
    { id: 'spring', name: 'Spring', icon: Sun },
    { id: 'summer', name: 'Summer', icon: Sun },
    { id: 'autumn', name: 'Autumn', icon: TreePine },
    { id: 'winter', name: 'Winter', icon: Snowflake }
  ];
  const features = [
    'All Meals', 'Airport Transfers', 'Professional Guide', 'Small Groups',
    'Luxury Accommodation', 'Free WiFi', 'Photography Tours', 'Cultural Experiences'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-primary-500/5 rounded-3xl" />
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-6 rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 rounded-t-3xl" />
              
              <div className="relative flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4"
                >
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
                    <p className="text-white/80 mt-1">Discover your perfect travel experience</p>
                  </div>
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200"
                >
                  <X className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="relative p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-10">
                {/* Basic Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mr-3">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    Basic Search
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        <MapPin className="w-4 h-4 inline mr-2 text-primary-600" />
                        Destination
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <DestinationAutocomplete
                            value={filters.query || ''}
                            onChange={(value) => updateFilter('query', value)}
                            placeholder="Where would you like to go?"
                            className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white/90 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        <Compass className="w-4 h-4 inline mr-2 text-primary-600" />
                        Continent
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <select
                          value={filters.continent || ''}
                          onChange={(e) => updateFilter('continent', e.target.value)}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Any Continent</option>
                          {continents.map(continent => (
                            <option key={continent} value={continent}>{continent}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Dates & Travelers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl mr-3">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Dates & Travelers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <input
                          type="date"
                          value={filters.startDate || ''}
                          onChange={(e) => updateFilter('startDate', e.target.value)}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">End Date</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <input
                          type="date"
                          value={filters.endDate || ''}
                          onChange={(e) => updateFilter('endDate', e.target.value)}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        <Users className="w-4 h-4 inline mr-2 text-primary-600" />
                        Adults
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <select
                          value={filters.adults || 2}
                          onChange={(e) => updateFilter('adults', Number(e.target.value))}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300 appearance-none cursor-pointer"
                        >
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>{num} Adult{num !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Children</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <select
                          value={filters.children || 0}
                          onChange={(e) => updateFilter('children', Number(e.target.value))}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300 appearance-none cursor-pointer"
                        >
                          {[0,1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl mr-3">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                    Tour Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => {
                      const IconComponent = category.icon;
                      const isSelected = filters.category === category.id;
                      return (
                        <motion.button
                          key={category.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateFilter('category', isSelected ? undefined : category.id)}
                          className={cn(
                            "relative p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden",
                            isSelected
                              ? "bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-400 text-white shadow-lg"
                              : "bg-white/80 backdrop-blur-sm border-white/40 text-gray-700 hover:bg-white hover:shadow-lg"
                          )}
                        >
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            isSelected && "opacity-0"
                          )} />
                          <div className="relative flex flex-col items-center space-y-2">
                            <IconComponent className="w-6 h-6" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Price & Duration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-secondary-600 to-primary-500 rounded-xl mr-3">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    Price & Duration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Min Price (GH₵)</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <input
                          type="number"
                          value={filters.minPrice || ''}
                          onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="0"
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Max Price (GH₵)</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <input
                          type="number"
                          value={filters.maxPrice || ''}
                          onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="10000"
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        <Clock className="w-4 h-4 inline mr-2 text-primary-600" />
                        Duration
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <select
                          value={filters.duration || ''}
                          onChange={(e) => updateFilter('duration', e.target.value)}
                          className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white shadow-lg hover:shadow-xl transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Any Duration</option>
                          {durations.map(duration => (
                            <option key={duration} value={duration}>{duration}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/30"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    className="flex-1 relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-secondary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-3 px-8 py-4 text-white font-semibold shadow-xl">
                      <Search className="w-5 h-5" />
                      <span>Search Adventures</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAllFilters}
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-2 px-6 py-4 text-gray-700 font-semibold">
                      <X className="w-4 h-4" />
                      <span>Clear All</span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
