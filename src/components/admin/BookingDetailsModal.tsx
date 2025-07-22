'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Users, MapPin, CreditCard, Phone, Mail, User, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { graphqlClient, formatPrice } from '@/lib/graphql-client';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onStatusUpdate: () => void;
}

interface BookingDetails {
  id: string;
  bookingReference: string;
  tour: {
    id: string;
    title: string;
    duration: number;
    destination: {
      name: string;
      country: {
        name: string;
      };
    };
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality?: string;
    passportNumber?: string;
    emergencyContact?: string;
    dietaryRequirements?: string;
    medicalConditions?: string;
  };
  startDate: string;
  endDate: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED' | 'FAILED';
  specialRequests?: string;
  travelers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    passportNumber?: string;
    dietaryRequirements?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const BOOKING_DETAILS_QUERY = `
  query BookingDetails($id: ID!) {
    booking(id: $id) {
      id
      bookingReference
      tour {
        id
        title
        duration
        destination {
          name
          country {
            name
          }
        }
      }
      customer {
        id
        firstName
        lastName
        email
        phone
        nationality
        passportNumber
        emergencyContact
        dietaryRequirements
        medicalConditions
      }
      startDate
      endDate
      adultsCount
      childrenCount
      totalPrice
      status
      paymentStatus
      specialRequests
      travelers {
        id
        firstName
        lastName
        age
        passportNumber
        dietaryRequirements
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_BOOKING_STATUS_MUTATION = `
  mutation UpdateBookingStatus($id: ID!, $status: BookingStatus!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function BookingDetailsModal({ isOpen, onClose, bookingId, onStatusUpdate }: BookingDetailsModalProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingDetails();
    }
  }, [isOpen, bookingId]);

  const loadBookingDetails = async () => {
    if (!bookingId) {
      console.log('❌ No bookingId provided to BookingDetailsModal');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔍 Loading booking details for ID:', bookingId);
      
      const token = localStorage.getItem('adminToken');
      console.log('🔑 Admin token exists:', !!token);
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }
      
      graphqlClient.setAuthToken(token);
      
      const result = await graphqlClient.request(BOOKING_DETAILS_QUERY, { id: bookingId });
      
      console.log('📋 Booking details result:', result);
      console.log('📊 Booking data:', result.booking);
      
      setBooking(result.booking);
      
      if (result.booking) {
        console.log('✅ Successfully loaded booking details');
      } else {
        console.log('⚠️ No booking data returned from API');
        setError('No booking found with this ID');
      }
      
    } catch (error: any) {
      console.error('❌ Error loading booking details:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      
      if (error.message && error.message.includes('Not authenticated')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load booking details: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('adminToken');
      graphqlClient.setAuthToken(token);
      await graphqlClient.request(UPDATE_BOOKING_STATUS_MUTATION, { 
        id: booking.id, 
        status: newStatus 
      });
      
      setBooking(prev => prev ? { ...prev, status: newStatus as any } : null);
      onStatusUpdate();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PARTIALLY_PAID: 'bg-orange-100 text-orange-800',
      REFUNDED: 'bg-purple-100 text-purple-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Booking Details</h2>
                  <p className="text-white/80 mt-1">
                    {booking ? `Reference: ${booking.bookingReference}` : 'Loading booking information...'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            {booking && (
              <div className="space-y-8">
                {/* Status and Actions */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate('CONFIRMED')}
                        disabled={updating}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('CANCELLED')}
                        disabled={updating}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Tour Information */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    Tour Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Tour Name</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.tour.title}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Destination</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {booking.tour.destination.name}, {booking.tour.destination.country.name}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Duration</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.tour.duration} days</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Travel Dates</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.firstName} {booking.customer.lastName}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {booking.customer.email}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {booking.customer.phone}
                      </p>
                    </div>
                    {booking.customer.nationality && (
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Nationality</label>
                        <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.nationality}</p>
                      </div>
                    )}
                    {booking.customer.passportNumber && (
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Passport Number</label>
                        <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.passportNumber}</p>
                      </div>
                    )}
                    {booking.customer.emergencyContact && (
                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Emergency Contact</label>
                        <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.emergencyContact}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    Booking Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Adults</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        {booking.adultsCount}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Children</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        {booking.childrenCount}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Total Price</label>
                      <p className="text-xl font-bold text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        {formatPrice(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                {(booking.customer.dietaryRequirements || booking.customer.medicalConditions || booking.specialRequests) && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                      Special Requirements
                    </h3>
                    <div className="space-y-4">
                      {booking.customer.dietaryRequirements && (
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">Dietary Requirements</label>
                          <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.dietaryRequirements}</p>
                        </div>
                      )}
                      {booking.customer.medicalConditions && (
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">Medical Conditions</label>
                          <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.customer.medicalConditions}</p>
                        </div>
                      )}
                      {booking.specialRequests && (
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">Special Requests</label>
                          <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Travelers */}
                {booking.travelers && booking.travelers.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      Travelers ({booking.travelers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {booking.travelers.map((traveler, index) => (
                        <div key={traveler.id} className="bg-white/50 rounded-2xl p-6 border border-white/20">
                          <h4 className="font-semibold text-gray-900 mb-4">Traveler {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Name</label>
                              <p className="font-medium text-gray-900">{traveler.firstName} {traveler.lastName}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Age</label>
                              <p className="font-medium text-gray-900">{traveler.age}</p>
                            </div>
                            {traveler.passportNumber && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600">Passport</label>
                                <p className="font-medium text-gray-900">{traveler.passportNumber}</p>
                              </div>
                            )}
                            {traveler.dietaryRequirements && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600">Dietary Requirements</label>
                                <p className="font-medium text-gray-900">{traveler.dietaryRequirements}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Timeline */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <Clock className="w-6 h-6 text-gray-600" />
                    </div>
                    Booking Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Created</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{formatDateTime(booking.createdAt)}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Last Updated</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{formatDateTime(booking.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
