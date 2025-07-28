'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FileText, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';
import { formatPrice } from '@/lib/currency';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onPaymentUpdate: () => void;
}

interface BookingInfo {
  id: string;
  bookingReference: string;
  totalPrice: number;
  paymentStatus: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  tour: {
    title: string;
    destination: {
      name: string;
    };
  };
  payments: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }>;
}

const BOOKING_INFO_QUERY = `
  query BookingInfo($id: ID!) {
    booking(id: $id) {
      id
      bookingReference
      totalPrice
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
      payments {
        id
        amount
        paymentMethod
        status
        createdAt
      }
    }
  }
`;

const RECORD_PAYMENT_MUTATION = `
  mutation RecordPayment($input: RecordPaymentInput!) {
    recordPayment(input: $input) {
      id
      amount
      paymentMethod
      status
      createdAt
    }
  }
`;

export default function PaymentModal({ isOpen, onClose, bookingId, onPaymentUpdate }: PaymentModalProps) {
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: '' as '' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE' | 'OTHER',
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingInfo();
    }
  }, [isOpen, bookingId]);

  const loadBookingInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }
      
      graphqlClient.setAuthToken(token);
      const result = await graphqlClient.request(BOOKING_INFO_QUERY, { id: bookingId });
      
      setBooking(result.booking);
      
      // Calculate remaining amount to pay
      const totalPaid = result.booking.payments
        .filter((p: any) => p.status === 'PAID')
        .reduce((sum: number, p: any) => sum + p.amount, 0);
      
      const remainingAmount = result.booking.totalPrice - totalPaid;
      setPaymentData(prev => ({
        ...prev,
        amount: Math.max(0, remainingAmount)
      }));
      
    } catch (error: any) {
      console.error('Error loading booking info:', error);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.paymentMethod || paymentData.amount <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('adminToken');
      graphqlClient.setAuthToken(token);
      
      const input = {
        bookingId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        paymentDate: paymentData.paymentDate,
        notes: paymentData.notes
      };
      
      await graphqlClient.request(RECORD_PAYMENT_MUTATION, { input });
      
      setSuccess('Payment recorded successfully!');
      onPaymentUpdate();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error recording payment:', error);
      setError('Failed to record payment: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const updatePaymentData = (field: string, value: any) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTotalPaid = () => {
    if (!booking) return 0;
    return booking.payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingAmount = () => {
    if (!booking) return 0;
    return booking.totalPrice - getTotalPaid();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Record Payment</h2>
                  <p className="text-white/80">
                    {booking ? `${booking.bookingReference} - ${booking.customer.firstName} ${booking.customer.lastName}` : 'Loading...'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {booking && (
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tour:</span>
                      <p className="font-medium">{booking.tour.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Destination:</span>
                      <p className="font-medium">{booking.tour.destination.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-medium">{formatPrice(booking.totalPrice)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount Paid:</span>
                      <p className="font-medium">{formatPrice(getTotalPaid())}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <p className="font-medium text-primary-600">{formatPrice(getRemainingAmount())}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium capitalize">{booking.paymentStatus.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        value={paymentData.paymentMethod}
                        onChange={(e) => updatePaymentData('paymentMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
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
                        Amount (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={getRemainingAmount() / 100}
                        value={paymentData.amount / 100}
                        onChange={(e) => updatePaymentData('amount', parseFloat(e.target.value) * 100)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Reference
                      </label>
                      <input
                        type="text"
                        value={paymentData.reference}
                        onChange={(e) => updatePaymentData('reference', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Transaction ID, receipt number, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={paymentData.paymentDate}
                        onChange={(e) => updatePaymentData('paymentDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Notes
                    </label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => updatePaymentData('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Any additional notes about this payment..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !paymentData.paymentMethod || paymentData.amount <= 0}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Recording Payment...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5 mr-2" />
                          Record Payment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
