import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, Users, Mail, Phone, Copy, Download } from 'lucide-react';
import { BookingResult } from '@/hooks/useBooking';
import { convertPesewasToCedis } from '@/lib/graphql-client';

interface BookingSuccessProps {
  booking: BookingResult;
  onNewBooking: () => void;
}

export default function BookingSuccess({ booking, onNewBooking }: BookingSuccessProps) {
  const copyBookingReference = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    // You could add a toast notification here
  };

  const downloadBookingConfirmation = () => {
    // This would generate a PDF or open a print dialog
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-neutral-600">
          Your adventure to {booking.tour.destination.name}, {booking.tour.destination.country.name} is confirmed
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Booking Details</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Reference:</span>
            <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-1 rounded-lg">
              <span className="font-mono font-medium text-neutral-900">{booking.bookingReference}</span>
              <button
                onClick={copyBookingReference}
                className="p-1 hover:bg-neutral-200 rounded transition-colors"
                title="Copy booking reference"
              >
                <Copy className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tour Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary-600" />
              Tour Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Tour:</span>
                <span className="font-medium text-neutral-900">{booking.tour.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Destination:</span>
                <span className="text-neutral-900">
                  {booking.tour.destination.name}, {booking.tour.destination.country.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Start Date:</span>
                <span className="text-neutral-900">
                  {new Date(booking.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">End Date:</span>
                <span className="text-neutral-900">
                  {new Date(booking.endDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary-600" />
              Booking Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Adults:</span>
                <span className="text-neutral-900">{booking.adultsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Children:</span>
                <span className="text-neutral-900">{booking.childrenCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Price:</span>
                <span className="font-semibold text-neutral-900">
                  GH₵{convertPesewasToCedis(booking.totalPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.paymentStatus === 'PAID' 
                    ? 'bg-green-100 text-green-800'
                    : booking.paymentStatus === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Customer Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
          <Mail className="w-4 h-4 mr-2 text-primary-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Name:</span>
            <span className="text-neutral-900">{booking.customer.firstName} {booking.customer.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Email:</span>
            <span className="text-neutral-900">{booking.customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Phone:</span>
            <span className="text-neutral-900">{booking.customer.phone}</span>
          </div>
        </div>
      </motion.div>

      {/* Travelers */}
      {booking.travelers && booking.travelers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h3 className="font-medium text-neutral-900 mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary-600" />
            Travelers ({booking.travelers.length})
          </h3>
          <div className="space-y-3">
            {booking.travelers.map((traveler, index) => (
              <div key={traveler.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <span className="font-medium text-neutral-900">
                    {traveler.firstName} {traveler.lastName}
                  </span>
                  <span className="text-sm text-neutral-600 ml-2">
                    (Age: {traveler.age})
                  </span>
                </div>
                {traveler.passportNumber && (
                  <span className="text-sm text-neutral-600">
                    Passport: {traveler.passportNumber}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={downloadBookingConfirmation}
          className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Confirmation
        </button>
        <button
          onClick={onNewBooking}
          className="flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Book Another Tour
        </button>
      </motion.div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• A confirmation email has been sent to {booking.customer.email}</li>
          <li>• Please keep your booking reference ({booking.bookingReference}) for future correspondence</li>
          <li>• Our team will contact you 48 hours before your tour departure</li>
          <li>• For any changes or cancellations, please contact us at least 72 hours in advance</li>
        </ul>
      </motion.div>
    </div>
  );
}
