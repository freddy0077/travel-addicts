'use client';

import { useState } from 'react';
import { X, Upload, MapPin, DollarSign, Star, Globe, Calendar, Camera, Sparkles, Plus, Minus } from 'lucide-react';
import { graphqlClient, CREATE_DESTINATION_MUTATION } from '@/lib/graphql-client';
import MediaUpload from '@/components/ui/MediaUpload';

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDestinationAdded: () => void;
}

interface DestinationFormData {
  name: string;
  country: string;
  continent: string;
  type: string;
  season: string;
  description: string;
  highlights: string[];
  image: string;
  gallery: string[];
  priceFrom: string;
  duration: string;
  bestTime: string;
  climate: string;
  activities: string[];
  featured: boolean;
}

const CONTINENTS = [
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'
];

const DESTINATION_TYPES = [
  'City', 'Beach', 'Mountain', 'Desert', 'Island', 'Cultural', 'Adventure', 'Wildlife', 'Historical'
];

const SEASONS = [
  'All Year', 'Spring', 'Summer', 'Fall', 'Winter', 'Dry Season', 'Wet Season'
];

export default function AddDestinationModal({ isOpen, onClose, onDestinationAdded }: AddDestinationModalProps) {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: '',
    country: '',
    continent: '',
    type: '',
    season: '',
    description: '',
    highlights: [''],
    image: '',
    gallery: [''],
    priceFrom: '',
    duration: '',
    bestTime: '',
    climate: '',
    activities: [''],
    featured: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadKey, setUploadKey] = useState(0);

  const handleInputChange = (field: keyof DestinationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'highlights' | 'gallery' | 'activities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'highlights' | 'gallery' | 'activities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'gallery' | 'activities', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.country || !formData.continent || !formData.description || !formData.priceFrom) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data for GraphQL mutation
      const input = {
        name: formData.name,
        country: formData.country,
        continent: formData.continent,
        type: formData.type || 'City',
        season: formData.season || 'All Year',
        description: formData.description,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        image: formData.image || '/images/placeholder-destination.jpg',
        gallery: formData.gallery.filter(g => g.trim() !== ''),
        priceFrom: parseFloat(formData.priceFrom),
        duration: formData.duration || '3-5 days',
        bestTime: formData.bestTime || 'Year round',
        climate: formData.climate || 'Tropical',
        activities: formData.activities.filter(a => a.trim() !== ''),
        featured: formData.featured
      };

      const result = await graphqlClient.request(CREATE_DESTINATION_MUTATION, { input });

      if (result.createDestination) {
        onDestinationAdded();
        onClose();
        // Reset form
        setFormData({
          name: '',
          country: '',
          continent: '',
          type: '',
          season: '',
          description: '',
          highlights: [''],
          image: '',
          gallery: [''],
          priceFrom: '',
          duration: '',
          bestTime: '',
          climate: '',
          activities: [''],
          featured: false
        });
        setCurrentStep(1);
      }
    } catch (error: any) {
      console.error('Error creating destination:', error);
      setError(error.response?.errors?.[0]?.message || error.message || 'Failed to create destination');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-5xl transform transition-all duration-300 scale-100">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Create New Destination</h2>
                  <p className="text-white/80 mt-1">Add an amazing travel destination to your collection</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-white text-primary-600 shadow-lg' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-white' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <span className="text-white/80 text-sm">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'Details & Media' : 'Features & Review'
                }
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                        Destination Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg placeholder-gray-400"
                        placeholder="e.g., Santorini Island"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-primary-500" />
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="e.g., Greece"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Continent *
                        </label>
                        <select
                          required
                          value={formData.continent}
                          onChange={(e) => handleInputChange('continent', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Select Continent</option>
                          {CONTINENTS.map(continent => (
                            <option key={continent} value={continent}>{continent}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Select Type</option>
                          {DESTINATION_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Best Season
                        </label>
                        <select
                          value={formData.season}
                          onChange={(e) => handleInputChange('season', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Select Season</option>
                          {SEASONS.map(season => (
                            <option key={season} value={season}>{season}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 resize-none placeholder-gray-400"
                        placeholder="Describe this amazing destination... What makes it special? What can visitors expect?"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                          Price From (GHS) *
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={formData.priceFrom}
                          onChange={(e) => handleInputChange('priceFrom', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="1500.00"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          Duration
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="3-5 days"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details & Media */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Camera className="h-4 w-4 mr-2 text-purple-500" />
                        Main Image
                      </label>
                      
                      {/* Image Upload Component */}
                      <div className="space-y-4">
                        <MediaUpload
                          key={uploadKey}
                          onUploadComplete={(mediaFile) => {
                            // MediaFile object has a url property
                            handleInputChange('image', mediaFile.url);
                            setUploadKey(uploadKey + 1);
                          }}
                          onUploadError={(error) => {
                            setError(`Image upload failed: ${error}`);
                          }}
                          folder="destinations"
                          accept="image/*"
                          maxFiles={1}
                          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-primary-500 transition-colors"
                        />
                        
                        {/* Manual URL Input (fallback) */}
                        <div className="relative">
                          <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => handleInputChange('image', e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                            placeholder="Or paste image URL: https://example.com/image.jpg"
                          />
                          {formData.image && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  src={formData.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Best Time to Visit
                        </label>
                        <input
                          type="text"
                          value={formData.bestTime}
                          onChange={(e) => handleInputChange('bestTime', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="April to October"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Climate
                        </label>
                        <input
                          type="text"
                          value={formData.climate}
                          onChange={(e) => handleInputChange('climate', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="Mediterranean"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Preview */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Image Preview
                      </label>
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {formData.image ? (
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-2xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`text-center ${formData.image ? 'hidden' : ''}`}>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Image preview will appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features & Review */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Highlights */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        Highlights
                      </label>
                      <div className="space-y-3">
                        {formData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                              className="flex-1 px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                              placeholder="Enter a highlight..."
                            />
                            {formData.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('highlights', index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('highlights')}
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Highlight</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Activities */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Activities
                      </label>
                      <div className="space-y-3">
                        {formData.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={activity}
                              onChange={(e) => handleArrayChange('activities', index, e.target.value)}
                              className="flex-1 px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                              placeholder="Enter an activity..."
                            />
                            {formData.activities.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('activities', index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('activities')}
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Activity</span>
                        </button>
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="group">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 rounded-xl">
                            <Sparkles className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Featured Destination</h4>
                            <p className="text-sm text-gray-600">Highlight this destination on the homepage</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => handleInputChange('featured', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-4">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Destination'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
