'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Route, Save, Loader2, Camera } from 'lucide-react';
import { graphqlClient, UPDATE_TOUR_MUTATION, DESTINATIONS_QUERY } from '@/lib/graphql-client';
import MediaUpload from '@/components/ui/MediaUpload';

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
  mainImage: string;
}

interface Destination {
  id: string;
  name: string;
  country: {
    name: string;
    continent: string;
  };
}

interface EditTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
  onTourUpdated: () => void;
}

export default function EditTourModal({ 
  isOpen, 
  onClose, 
  tour, 
  onTourUpdated 
}: EditTourModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    destinationId: '',
    description: '',
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    duration: 1,
    groupSizeMax: 1,
    difficulty: 'EASY' as 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXTREME',
    priceFrom: 0,
    images: [] as string[],
    featured: false,
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    mainImage: ''
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [inclusionsInput, setInclusionsInput] = useState('');
  const [exclusionsInput, setExclusionsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [uploadKey, setUploadKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDestinations();
      // Initialize upload key for MediaUpload component
      setUploadKey(Date.now().toString());
    }
  }, [isOpen]);

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title,
        destinationId: tour.destination.id,
        description: tour.description,
        highlights: tour.highlights || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        duration: tour.duration,
        groupSizeMax: tour.groupSizeMax,
        difficulty: tour.difficulty,
        priceFrom: Math.round(tour.priceFrom / 100), // Convert from pesewas to cedis
        images: tour.images || [],
        featured: tour.featured,
        status: tour.status,
        mainImage: tour.mainImage
      });
      setHighlightsInput(tour.highlights?.join(', ') || '');
      setInclusionsInput(tour.inclusions?.join(', ') || '');
      setExclusionsInput(tour.exclusions?.join(', ') || '');
      setImagesInput(tour.images?.join(', ') || '');
    }
  }, [tour]);

  const loadDestinations = async () => {
    try {
      const result = await graphqlClient.request(DESTINATIONS_QUERY);
      setDestinations(result.destinations || []);
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Explicitly construct input object with only the fields expected by UpdateTourInput schema
      const input = {
        title: formData.title,
        destinationId: formData.destinationId,
        description: formData.description,
        highlights: highlightsInput.split(',').map(h => h.trim()).filter(h => h),
        inclusions: inclusionsInput.split(',').map(i => i.trim()).filter(i => i),
        exclusions: exclusionsInput.split(',').map(e => e.trim()).filter(e => e),
        duration: formData.duration,
        groupSizeMax: formData.groupSizeMax, // Backend expects groupSizeMax, not groupSize
        difficulty: formData.difficulty,
        priceFrom: formData.priceFrom * 100, // Convert cedis to pesewas
        images: formData.images,
        featured: formData.featured
        // Note: status is not part of UpdateTourInput schema
      };

      // Remove any undefined fields to ensure clean input
      const cleanInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => value !== undefined && value !== '')
      );

      console.log('Sending tour update request with clean input:', cleanInput);

      await graphqlClient.request(UPDATE_TOUR_MUTATION, {
        id: tour.id,
        input: cleanInput
      });

      onTourUpdated();
      onClose();
    } catch (err: any) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUploadComplete = (file: any) => {
    if (file && file.url) {
      // Update the first image URL with the uploaded image (same pattern as AddTourModal)
      setFormData(prev => ({
        ...prev,
        images: [file.url, ...prev.images.slice(1)]
      }));
      
      // Force re-render of MediaUpload component for subsequent uploads
      setUploadKey(Date.now().toString());
    }
  };

  useEffect(() => {
    if (formData.images.length > 0) {
      setFormData(prev => ({ ...prev, mainImage: prev.images[0] }));
    }
  }, [formData.images]);

  if (!tour) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 text-left align-middle shadow-xl transition-all border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Route className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                        Edit Tour
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Update tour information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tour Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Destination *
                        </label>
                        <select
                          value={formData.destinationId}
                          onChange={(e) => handleInputChange('destinationId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select destination</option>
                          {destinations.map((destination) => (
                            <option key={destination.id} value={destination.id}>
                              {destination.name}, {destination.country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (days) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Group Size *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.groupSizeMax}
                            onChange={(e) => handleInputChange('groupSizeMax', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty *
                          </label>
                          <select
                            value={formData.difficulty}
                            onChange={(e) => handleInputChange('difficulty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          >
                            <option value="EASY">Easy</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="CHALLENGING">Challenging</option>
                            <option value="EXTREME">Extreme</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price From (GH₵) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.priceFrom}
                            onChange={(e) => handleInputChange('priceFrom', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Featured tour
                        </label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gallery Images
                        </label>
                        <MediaUpload
                          uploadKey={uploadKey}
                          onUploadComplete={handleUploadComplete}
                          folder="tours"
                          className="w-full"
                          showPreview={true}
                          maxFiles={10}
                        />
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Gallery Images (comma-separated URLs)
                          </label>
                          <textarea
                            value={formData.images.join(', ')}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              images: e.target.value.split(',').map(url => url.trim()).filter(url => url) 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter multiple image URLs separated by commas
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Highlights (comma-separated)
                        </label>
                        <textarea
                          value={highlightsInput}
                          onChange={(e) => setHighlightsInput(e.target.value)}
                          rows={3}
                          placeholder="e.g., Amazing views, Local culture, Wildlife"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inclusions (comma-separated)
                        </label>
                        <textarea
                          value={inclusionsInput}
                          onChange={(e) => setInclusionsInput(e.target.value)}
                          rows={3}
                          placeholder="e.g., Accommodation, Meals, Transport"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exclusions (comma-separated)
                        </label>
                        <textarea
                          value={exclusionsInput}
                          onChange={(e) => setExclusionsInput(e.target.value)}
                          rows={3}
                          placeholder="e.g., Personal expenses, Tips, Insurance"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Tour
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
