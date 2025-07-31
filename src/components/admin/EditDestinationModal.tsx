'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, Save, Loader2 } from 'lucide-react';
import { graphqlClient, UPDATE_DESTINATION_MUTATION } from '@/lib/graphql-client';
import MediaUpload from '@/components/ui/MediaUpload'; // Fix import statement

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
}

interface EditDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
  onDestinationUpdated: () => void;
}

export default function EditDestinationModal({ 
  isOpen, 
  onClose, 
  destination, 
  onDestinationUpdated 
}: EditDestinationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mainImage: '',
    gallery: [] as string[],
    priceFrom: 0,
    featured: false,
    type: '',
    season: '',
    duration: '',
    bestTime: '',
    climate: '',
    activities: [] as string[],
    highlights: [] as string[],
    country: '',
    continent: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadKey, setUploadKey] = useState(0);
  const [activitiesInput, setActivitiesInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name,
        description: destination.description,
        mainImage: destination.image,
        gallery: destination.gallery || [],
        priceFrom: destination.priceFrom, // Already in cedis
        featured: destination.featured,
        type: destination.type,
        season: destination.season,
        duration: destination.duration,
        bestTime: destination.bestTime,
        climate: destination.climate,
        activities: destination.activities || [],
        highlights: destination.highlights || [],
        country: destination.country.name,
        continent: destination.country.continent
      });
      setActivitiesInput(destination.activities?.join(', ') || '');
      setHighlightsInput(destination.highlights?.join(', ') || '');
    }
  }, [destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Explicitly construct input object with only the fields expected by the backend
      const input = {
        name: formData.name,
        description: formData.description,
        image: formData.mainImage, // Map mainImage to image for backend
        gallery: formData.gallery,
        priceFrom: formData.priceFrom, // Store price as entered (no conversion)
        featured: formData.featured,
        type: formData.type,
        season: formData.season,
        duration: formData.duration,
        bestTime: formData.bestTime,
        climate: formData.climate,
        activities: activitiesInput.split(',').map(a => a.trim()).filter(a => a),
        highlights: highlightsInput.split(',').map(h => h.trim()).filter(h => h),
        country: formData.country,
        continent: formData.continent
      };

      // Remove any undefined fields to ensure clean input
      const cleanInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => value !== undefined && value !== '')
      );

      console.log('Sending update request with clean input:', cleanInput);

      await graphqlClient.request(UPDATE_DESTINATION_MUTATION, {
        id: destination.id,
        input: cleanInput
      });

      onDestinationUpdated();
      onClose();
    } catch (err: any) {
      console.error('Error updating destination:', err);
      setError(err.message || 'Failed to update destination');
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

  if (!destination) return null;

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 text-left align-middle shadow-xl transition-all border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                        Edit Destination
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Update destination information
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
                          Destination Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Destination Images
                        </label>
                        <MediaUpload
                          key={uploadKey}
                          onUploadComplete={(mediaFile) => {
                            // Add image to gallery array
                            setFormData(prev => ({
                              ...prev,
                              gallery: [...prev.gallery, mediaFile.url],
                              mainImage: prev.mainImage || mediaFile.url // Set as main image if no main image exists
                            }));
                            setUploadKey(uploadKey + 1);
                          }}
                          onUploadError={(error) => {
                            setError(`Image upload failed: ${error}`);
                          }}
                          folder="destinations"
                          accept="image/*"
                          multiple={true}
                          maxFiles={10}
                          showPreview={true}
                          className="w-full"
                        />
                        
                        {/* Manual Gallery URLs Input */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Gallery Images (comma-separated URLs)
                          </label>
                          <textarea
                            value={formData.gallery.join(', ')}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              gallery: e.target.value.split(',').map(url => url.trim()).filter(url => url) 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter multiple image URLs separated by commas, or use the upload above
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price From (USD) *
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select type</option>
                            <option value="Beach">Beach</option>
                            <option value="City">City</option>
                            <option value="Mountains">Mountains</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Historical">Historical</option>
                            <option value="Nature">Nature</option>
                            <option value="Adventure">Adventure</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder="e.g., Ghana"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Continent *
                          </label>
                          <select
                            value={formData.continent}
                            onChange={(e) => handleInputChange('continent', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select continent</option>
                            <option value="Africa">Africa</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="South America">South America</option>
                            <option value="Oceania">Oceania</option>
                            <option value="Antarctica">Antarctica</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Season *
                          </label>
                          <select
                            value={formData.season}
                            onChange={(e) => handleInputChange('season', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select season</option>
                            <option value="All Year">All Year</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                            <option value="Winter">Winter</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration *
                          </label>
                          <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            placeholder="e.g., 3-5 days"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Best Time to Visit *
                        </label>
                        <input
                          type="text"
                          value={formData.bestTime}
                          onChange={(e) => handleInputChange('bestTime', e.target.value)}
                          placeholder="e.g., November to March"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Climate *
                        </label>
                        <input
                          type="text"
                          value={formData.climate}
                          onChange={(e) => handleInputChange('climate', e.target.value)}
                          placeholder="e.g., Tropical, Humid"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Activities (comma-separated)
                        </label>
                        <textarea
                          value={activitiesInput}
                          onChange={(e) => setActivitiesInput(e.target.value)}
                          rows={3}
                          placeholder="e.g., Surfing, Beach walks, Cultural tours"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Highlights (comma-separated)
                        </label>
                        <textarea
                          value={highlightsInput}
                          onChange={(e) => setHighlightsInput(e.target.value)}
                          rows={3}
                          placeholder="e.g., Beautiful beaches, Local culture, Historic sites"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
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
                          Featured destination
                        </label>
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
                          Update Destination
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
