'use client';

import { useState, useEffect } from 'react';
import { X, Upload, MapPin, DollarSign, Star, Globe, Calendar, Camera, Sparkles, Plus, Minus, Users, Clock, Mountain } from 'lucide-react';
import { graphqlClient, CREATE_TOUR_MUTATION, DESTINATIONS_QUERY, convertCedisToPesewas } from '@/lib/graphql-client';
import MediaUpload from '@/components/ui/MediaUpload';

interface AddTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTourAdded: () => void;
}

interface Destination {
  id: string;
  name: string;
  country: {
    id: string;
    name: string;
    code: string;
    continent: string;
  };
}

interface TourFormData {
  title: string;
  destinationId: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  duration: string;
  groupSizeMax: string;
  difficulty: string;
  priceFrom: string;
  images: string[];
  featured: boolean;
}

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy', color: 'text-green-600' },
  { value: 'MODERATE', label: 'Moderate', color: 'text-yellow-600' },
  { value: 'CHALLENGING', label: 'Challenging', color: 'text-orange-600' },
  { value: 'EXTREME', label: 'Extreme', color: 'text-red-600' }
];

export default function AddTourModal({ isOpen, onClose, onTourAdded }: AddTourModalProps) {
  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    destinationId: '',
    description: '',
    highlights: [''],
    inclusions: [''],
    exclusions: [''],
    duration: '',
    groupSizeMax: '',
    difficulty: 'EASY',
    priceFrom: '',
    images: [''],
    featured: false
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadKey, setUploadKey] = useState('');

  // Load destinations on mount
  useEffect(() => {
    if (isOpen) {
      loadDestinations();
    }
  }, [isOpen]);

  const loadDestinations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const result = await graphqlClient.request(DESTINATIONS_QUERY, {}, {
        'Authorization': `Bearer ${token}`
      });
      setDestinations(result.destinations || []);
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  const handleInputChange = (field: keyof TourFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'highlights' | 'inclusions' | 'exclusions' | 'images', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions' | 'images') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions' | 'images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleUploadComplete = (file: any) => {
    if (file && file.url) {
      // Update the first image URL with the uploaded image
      setFormData(prev => ({
        ...prev,
        images: [file.url, ...prev.images.slice(1)]
      }));
      
      // Force re-render of MediaUpload component for subsequent uploads
      setUploadKey(Date.now().toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.destinationId || !formData.description || !formData.duration || !formData.groupSizeMax || !formData.priceFrom) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('adminToken');
      
      const tourInput = {
        title: formData.title,
        destinationId: formData.destinationId,
        description: formData.description,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        inclusions: formData.inclusions.filter(i => i.trim() !== ''),
        exclusions: formData.exclusions.filter(e => e.trim() !== ''),
        duration: parseInt(formData.duration),
        groupSizeMax: parseInt(formData.groupSizeMax),
        difficulty: formData.difficulty,
        priceFrom: convertCedisToPesewas(parseFloat(formData.priceFrom)),
        images: formData.images.filter(img => img.trim() !== ''),
        featured: formData.featured
      };

      await graphqlClient.request(CREATE_TOUR_MUTATION, { input: tourInput }, {
        'Authorization': `Bearer ${token}`
      });

      // Reset form
      setFormData({
        title: '',
        destinationId: '',
        description: '',
        highlights: [''],
        inclusions: [''],
        exclusions: [''],
        duration: '',
        groupSizeMax: '',
        difficulty: 'EASY',
        priceFrom: '',
        images: [''],
        featured: false
      });
      
      setCurrentStep(1);
      onTourAdded();
      onClose();
    } catch (error) {
      console.error('Error creating tour:', error);
      setError('Failed to create tour. Please try again.');
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

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nextStep();
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    prevStep();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Details & Pricing';
      case 3: return 'Features & Review';
      default: return 'Tour Details';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-3xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Add New Tour</h3>
                  <p className="text-primary-100 mt-1">Create an amazing travel experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-white text-primary-600 shadow-lg' 
                      : 'bg-white/20 text-white/70'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step < currentStep ? 'bg-white' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white/90 font-medium">{getStepTitle()}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Globe className="h-4 w-4 mr-2 text-primary-500" />
                      Tour Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Amazing Safari Adventure"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      Destination *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={formData.destinationId}
                      onChange={(e) => handleInputChange('destinationId', e.target.value)}
                      required
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name}, {dest.country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Camera className="h-4 w-4 mr-2 text-primary-500" />
                    Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                    placeholder="Describe this amazing tour experience..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="h-4 w-4 mr-2 text-primary-500" />
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="7"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Users className="h-4 w-4 mr-2 text-primary-500" />
                      Max Group Size *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="12"
                      value={formData.groupSizeMax}
                      onChange={(e) => handleInputChange('groupSizeMax', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Mountain className="h-4 w-4 mr-2 text-primary-500" />
                      Difficulty Level *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      required
                    >
                      {DIFFICULTY_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign className="h-4 w-4 mr-2 text-primary-500" />
                    Price From (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="2500.00"
                    value={formData.priceFrom}
                    onChange={(e) => handleInputChange('priceFrom', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Star className="h-4 w-4 mr-2 text-primary-500" />
                    Tour Highlights
                  </label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Wildlife viewing in national parks"
                        value={highlight}
                        onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      />
                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('highlights', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights')}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Highlight
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Plus className="h-4 w-4 mr-2 text-green-500" />
                      What's Included
                    </label>
                    {formData.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., All meals and accommodation"
                          value={inclusion}
                          onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                        />
                        {formData.inclusions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('inclusions', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('inclusions')}
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Inclusion
                    </button>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Minus className="h-4 w-4 mr-2 text-red-500" />
                      What's Excluded
                    </label>
                    {formData.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., International flights"
                          value={exclusion}
                          onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                        />
                        {formData.exclusions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('exclusions', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('exclusions')}
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Exclusion
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Camera className="h-4 w-4 mr-2 text-primary-500" />
                    Tour Images
                  </label>
                  
                  {/* Image Upload Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Upload Main Image</h4>
                    <MediaUpload
                      key={uploadKey}
                      onUploadComplete={handleUploadComplete}
                      folder="tours"
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload an image to automatically populate the first image URL below
                    </p>
                  </div>

                  {/* Manual URL Inputs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Image URLs</h4>
                    {formData.images.map((image, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="url"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            placeholder={index === 0 ? "Main image URL (auto-filled from upload above)" : "https://example.com/tour-image.jpg"}
                            value={image}
                            onChange={(e) => handleArrayChange('images', index, e.target.value)}
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('images', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {image && (
                          <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden">
                            <img
                              src={image}
                              alt={`Tour image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className={`text-center ${formData.image ? 'hidden' : ''}`}>
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mt-8" />
                              <p className="text-gray-500 text-sm mt-2">Image preview</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('images')}
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Image
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-xl">
                        <Star className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Featured Tour</h4>
                        <p className="text-sm text-gray-600">Highlight this tour on the homepage</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    } text-white`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Tour...
                      </div>
                    ) : (
                      'Create Tour'
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
