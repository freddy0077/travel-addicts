'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard,
  FileText,
  Loader2,
  Search,
  Plus,
  Minus
} from 'lucide-react';
import { graphqlClient, formatPrice, TOURS_QUERY } from '@/lib/graphql-client';
import DestinationAutocomplete from '@/components/ui/DestinationAutocomplete';

interface Tour {
  id: string;
  title: string;
  priceFrom: number;
  destination: {
    name: string;
    country: {
      name: string;
    };
  };
}

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: () => void;
}

const CREATE_BOOKING_MUTATION = `
  mutation CreateManualBooking($input: CreateManualBookingInput!) {
    createManualBooking(input: $input) {
      id
      bookingReference
      status
      paymentStatus
      customer {
        firstName
        lastName
        email
      }
      tour {
        title
        destination {
          name
        }
      }
    }
  }
`;

export default function CreateBookingModal({ isOpen, onClose, onBookingCreated }: CreateBookingModalProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourSearchTerm, setTourSearchTerm] = useState('');
  const [showTourDropdown, setShowTourDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTours, setIsLoadingTours] = useState(false);

  // Destination search state
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [filteredToursByDestination, setFilteredToursByDestination] = useState<Tour[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    // Customer details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Booking details
    tourId: '',
    startDate: '',
    endDate: '',
    adultsCount: 1,
    childrenCount: 0,
    specialRequests: '',
    
    // Payment details
    totalPrice: 0,
    paymentStatus: 'PENDING' as 'PENDING' | 'PAID' | 'PARTIALLY_PAID',
    status: 'PENDING' as 'PENDING' | 'CONFIRMED',
    
    // Offline payment details
    paymentMethod: '' as '' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE' | 'OTHER',
    paidAmount: 0,
    paymentReference: '',
    paymentDate: '',
    paymentNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadTours();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTour) {
      const totalGuests = formData.adultsCount + formData.childrenCount;
      const calculatedPrice = selectedTour.priceFrom * totalGuests;
      setFormData(prev => ({
        ...prev,
        tourId: selectedTour.id,
        totalPrice: calculatedPrice
      }));
    }
  }, [selectedTour, formData.adultsCount, formData.childrenCount]);

  useEffect(() => {
    if (selectedDestination) {
      const filteredTours = tours.filter(tour => tour.destination.name === selectedDestination.name);
      setFilteredToursByDestination(filteredTours);
    }
  }, [selectedDestination, tours]);

  useEffect(() => {
    if (formData.totalPrice > 0 && formData.paidAmount > 0) {
      if (formData.paidAmount >= formData.totalPrice) {
        setFormData(prev => ({ ...prev, paymentStatus: 'PAID' }));
      } else if (formData.paidAmount > 0) {
        setFormData(prev => ({ ...prev, paymentStatus: 'PARTIALLY_PAID' }));
      }
    } else if (formData.paidAmount === 0) {
      setFormData(prev => ({ ...prev, paymentStatus: 'PENDING' }));
    }
  }, [formData.paidAmount, formData.totalPrice]);

  const loadTours = async () => {
    try {
      setIsLoadingTours(true);
      console.log('🎯 Loading tours from API...');
      
      const result = await graphqlClient.request<{ tours: Tour[] }>(TOURS_QUERY);
      console.log('📋 Tours loaded:', result);
      
      const tours = result.tours || [];
      setTours(tours);
      console.log(`✅ Successfully loaded ${tours.length} tours`);
      
    } catch (error) {
      console.error('❌ Error loading tours:', error);
      
      // Fallback tours for development/testing
      const fallbackTours: Tour[] = [
        {
          id: '1',
          title: 'Accra City Tour',
          priceFrom: 15000, // 150 GHS in pesewas
          destination: {
            name: 'Accra',
            country: { name: 'Ghana' }
          }
        },
        {
          id: '2',
          title: 'Cape Coast Castle Experience',
          priceFrom: 25000, // 250 GHS in pesewas
          destination: {
            name: 'Cape Coast',
            country: { name: 'Ghana' }
          }
        },
        {
          id: '3',
          title: 'Kumasi Cultural Safari',
          priceFrom: 35000, // 350 GHS in pesewas
          destination: {
            name: 'Kumasi',
            country: { name: 'Ghana' }
          }
        },
        {
          id: '4',
          title: 'Busua Beach Getaway',
          priceFrom: 45000, // 450 GHS in pesewas
          destination: {
            name: 'Busua Beach',
            country: { name: 'Ghana' }
          }
        },
        {
          id: '5',
          title: 'Kakum Canopy Walk Adventure',
          priceFrom: 20000, // 200 GHS in pesewas
          destination: {
            name: 'Kakum National Park',
            country: { name: 'Ghana' }
          }
        }
      ];
      
      setTours(fallbackTours);
      console.log(`🔄 Using fallback tours: ${fallbackTours.length} tours loaded`);
      
    } finally {
      setIsLoadingTours(false);
    }
  };

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(tourSearchTerm.toLowerCase()) ||
    tour.destination.name.toLowerCase().includes(tourSearchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Customer validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    // Booking validation
    if (!selectedTour) newErrors.tour = 'Please select a tour';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.adultsCount < 1) newErrors.adultsCount = 'At least 1 adult is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const bookingInput = {
        // Customer details
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        
        // Booking details
        tourId: formData.tourId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adultsCount: formData.adultsCount,
        childrenCount: formData.childrenCount,
        specialRequests: formData.specialRequests || null,
        
        // Payment details
        totalPrice: formData.totalPrice,
        paymentStatus: formData.paymentStatus,
        status: formData.status,
        
        // Offline payment details
        paymentMethod: formData.paymentMethod,
        paidAmount: formData.paidAmount,
        paymentReference: formData.paymentReference,
        paymentDate: formData.paymentDate,
        paymentNotes: formData.paymentNotes
      };

      await graphqlClient.request(CREATE_BOOKING_MUTATION, { input: bookingInput });
      
      onBookingCreated();
      handleClose();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tourId: '',
      startDate: '',
      endDate: '',
      adultsCount: 1,
      childrenCount: 0,
      specialRequests: '',
      totalPrice: 0,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      paymentMethod: '',
      paidAmount: 0,
      paymentReference: '',
      paymentDate: '',
      paymentNotes: ''
    });
    setSelectedTour(null);
    setTourSearchTerm('');
    setShowTourDropdown(false);
    setErrors({});
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create Manual Booking</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Destination Selection
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Destination
                  </label>
                  <DestinationAutocomplete
                    value={destinationSearchTerm}
                    onChange={setDestinationSearchTerm}
                    onDestinationSelect={(destination) => {
                      setSelectedDestination(destination);
                      setDestinationSearchTerm(destination.name);
                      // Clear tour selection when destination changes
                      setSelectedTour(null);
                      setTourSearchTerm('');
                    }}
                    placeholder="Start typing a destination name..."
                    className="w-full"
                  />
                  {selectedDestination && (
                    <div className="mt-2 p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-primary-900">{selectedDestination.name}</p>
                          <p className="text-sm text-primary-600">{selectedDestination.country.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDestination(null);
                            setDestinationSearchTerm('');
                            setFilteredToursByDestination([]);
                          }}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tour Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Tour Selection
                </h3>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tour *
                    {selectedDestination && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Showing tours for {selectedDestination.name})
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={tourSearchTerm}
                      onChange={(e) => {
                        setTourSearchTerm(e.target.value);
                        setShowTourDropdown(true);
                      }}
                      onFocus={() => setShowTourDropdown(true)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.tour ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder={selectedTour ? selectedTour.title : "Search for tours..."}
                    />
                  </div>
                  
                  {showTourDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingTours ? (
                        <div className="p-4 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Loading tours...</p>
                        </div>
                      ) : (selectedDestination ? filteredToursByDestination : filteredTours).length > 0 ? (
                        (selectedDestination ? filteredToursByDestination : filteredTours).map((tour) => (
                          <button
                            key={tour.id}
                            type="button"
                            onClick={() => {
                              setSelectedTour(tour);
                              setTourSearchTerm(tour.title);
                              setShowTourDropdown(false);
                              if (errors.tour) {
                                setErrors(prev => ({ ...prev, tour: '' }));
                              }
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{tour.title}</div>
                            <div className="text-sm text-gray-600 flex items-center justify-between">
                              <span>{tour.destination.name}, {tour.destination.country.name}</span>
                              <span className="font-semibold text-primary-600">{formatPrice(tour.priceFrom)}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-600">
                          {selectedDestination ? 
                            `No tours found for ${selectedDestination.name}` : 
                            'No tours found'
                          }
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.tour && (
                    <p className="mt-1 text-sm text-red-600">{errors.tour}</p>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults *
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateFormData('adultsCount', Math.max(1, formData.adultsCount - 1))}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{formData.adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => updateFormData('adultsCount', formData.adultsCount + 1)}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.adultsCount && (
                      <p className="mt-1 text-sm text-red-600">{errors.adultsCount}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateFormData('childrenCount', Math.max(0, formData.childrenCount - 1))}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{formData.childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => updateFormData('childrenCount', formData.childrenCount + 1)}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData('specialRequests', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>

              {/* Payment & Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Payment & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Price
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold text-gray-900">
                      {formatPrice(formData.totalPrice)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => updateFormData('paymentStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="PARTIALLY_PAID">Partially Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormData('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                    </select>
                  </div>
                </div>

                {/* Offline Payment Details */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    Offline Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select payment method</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="MOBILE_MONEY">Mobile Money</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paid Amount
                      </label>
                      <input
                        type="number"
                        value={formData.paidAmount}
                        onChange={(e) => updateFormData('paidAmount', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Reference
                      </label>
                      <input
                        type="text"
                        value={formData.paymentReference}
                        onChange={(e) => updateFormData('paymentReference', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => updateFormData('paymentDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Notes
                    </label>
                    <textarea
                      value={formData.paymentNotes}
                      onChange={(e) => updateFormData('paymentNotes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Any payment notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Create Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
