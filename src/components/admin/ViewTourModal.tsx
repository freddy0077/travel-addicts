'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, Star, Calendar, Users, Clock, Image as ImageIcon, Route, Target, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import Image from 'next/image';

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

interface ViewTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY': return 'bg-green-100 text-green-800';
    case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
    case 'CHALLENGING': return 'bg-orange-100 text-orange-800';
    case 'EXTREME': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-800';
    case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
    case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ViewTourModal({ isOpen, onClose, tour }: ViewTourModalProps) {
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
                        {tour.title}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        {tour.destination.name}, {tour.destination.country.name}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Images and Gallery */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                      {tour.images && tour.images.length > 0 && (
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                      <div className="absolute top-3 left-3 flex space-x-2">
                        {tour.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                          {tour.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                          {tour.difficulty}
                        </span>
                      </div>
                    </div>

                    {tour.images.length > 1 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Gallery ({tour.images.length} images)
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {tour.images.slice(1, 9).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${tour.title} gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{tour.description}</p>
                    </div>

                    {/* Highlights */}
                    {tour.highlights && tour.highlights.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h4>
                        <ul className="space-y-1">
                          {tour.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Inclusions & Exclusions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tour.inclusions && tour.inclusions.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Included</h4>
                          <ul className="space-y-1">
                            {tour.inclusions.map((inclusion, index) => (
                              <li key={index} className="text-sm text-green-600 flex items-start">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {inclusion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tour.exclusions && tour.exclusions.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Not Included</h4>
                          <ul className="space-y-1">
                            {tour.exclusions.map((exclusion, index) => (
                              <li key={index} className="text-sm text-red-600 flex items-start">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {exclusion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Tour Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Slug:</span>
                          <span className="text-sm font-medium text-gray-900">{tour.slug}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Price From:
                          </span>
                          <span className="text-sm font-medium text-green-600">{formatPrice(tour.priceFrom)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Duration:
                          </span>
                          <span className="text-sm font-medium text-gray-900">{tour.duration} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Max Group:
                          </span>
                          <span className="text-sm font-medium text-gray-900">{tour.groupSizeMax} people</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            Difficulty:
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                            {tour.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(tour.status)}`}>
                            {tour.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Destination Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Destination
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">{tour.destination.name}</p>
                        <p className="text-sm text-gray-600">{tour.destination.country.name}, {tour.destination.country.continent}</p>
                        <p className="text-xs text-gray-500">Country Code: {tour.destination.country.code}</p>
                      </div>
                    </div>

                    {/* Itinerary Summary */}
                    {tour.itinerary && tour.itinerary.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Route className="w-4 h-4 mr-2" />
                          Itinerary ({tour.itinerary.length} days)
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {tour.itinerary.map((day) => (
                            <div key={day.id} className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-medium">Day {day.dayNumber}: {day.title}</p>
                              <p className="text-gray-600 truncate">{day.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {new Date(tour.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(tour.updatedAt).toLocaleDateString()}</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
