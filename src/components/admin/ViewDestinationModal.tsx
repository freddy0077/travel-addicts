'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, Star, Calendar, Clock, Thermometer, Activity, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

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
    name: string;
    code: string;
    continent: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ViewDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
}

export default function ViewDestinationModal({ isOpen, onClose, destination }: ViewDestinationModalProps) {
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
                        {destination.name}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        {destination.country.name}, {destination.country.continent}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Image and Gallery */}
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {destination.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {destination.gallery && destination.gallery.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Gallery ({destination.gallery.length} images)
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {destination.gallery.slice(0, 6).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${destination.name} gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Slug:</span>
                          <span className="text-sm font-medium text-gray-900">{destination.slug}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="text-sm font-medium text-gray-900">{destination.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price From:</span>
                          <span className="text-sm font-medium text-green-600">{formatPrice(destination.priceFrom)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Travel Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Best Season:</span>
                            <p className="text-sm font-medium text-gray-900">{destination.season}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Duration:</span>
                            <p className="text-sm font-medium text-gray-900">{destination.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Thermometer className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Climate:</span>
                            <p className="text-sm font-medium text-gray-900">{destination.climate}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Best Time:</span>
                            <p className="text-sm font-medium text-gray-900">{destination.bestTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activities */}
                    {destination.activities && destination.activities.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Activity className="w-4 h-4 mr-2" />
                          Activities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {destination.activities.map((activity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {destination.highlights && destination.highlights.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h4>
                        <ul className="space-y-1">
                          {destination.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{destination.description}</p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {new Date(destination.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(destination.updatedAt).toLocaleDateString()}</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
