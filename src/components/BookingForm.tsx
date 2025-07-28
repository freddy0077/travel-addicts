import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, User, Mail, Phone, AlertCircle, Loader, CheckCircle, Banknote, MapPin } from 'lucide-react';
import { useBooking, CreateBookingInput, BookingCustomer, BookingTraveler } from '@/hooks/useBooking';
import { formatPrice, formatPriceWithConversionSync, preparePaymentConversionSync } from '@/lib/currency';
import PaystackPayment from './PaystackPayment';

interface TourData {
  id: string;
  title: string;
  slug: string;
  destination: {
    name: string;
    country: {
      name: string;
    };
  };
  duration: number;
  priceFrom: number;
  images: string[];
}

interface BookingFormProps {
  tour: TourData;
  onBookingSuccess: (booking: any) => void;
}

// Frontend traveler interface (includes additional fields for form)
interface FormBookingTraveler {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  type: 'adult' | 'child';
  dietaryRequirements: string;
  medicalConditions: string;
}

interface BookingFormState {
  currentStep: number;
  selectedDate: string;
  adults: number;
  children: number;
  customerInfo: BookingCustomer;
  travelers: FormBookingTraveler[];
  paymentReference: string | null;
  paymentVerified: boolean;
  paymentMethod: 'online' | 'cash';
  cashPaymentReceipt: File | null;
}

export default function BookingForm({ tour, onBookingSuccess }: BookingFormProps) {
  const { createBooking, isLoading, error } = useBooking();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState<BookingCustomer>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    emergencyContact: '',
    dietaryRequirements: '',
    medicalConditions: ''
  });

  // Travelers information
  const [travelers, setTravelers] = useState<FormBookingTraveler[]>([]);

  // Payment information
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [cashPaymentReceipt, setCashPaymentReceipt] = useState<File | null>(null);

  useEffect(() => {
    initializeTravelers(adults, children);
  }, [adults, children]);

  // Initialize travelers array
  const initializeTravelers = (adultCount: number, childCount: number) => {
    const newTravelers: FormBookingTraveler[] = [];
    
    // Add adults
    for (let i = 0; i < adultCount; i++) {
      newTravelers.push({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        type: 'adult',
        dietaryRequirements: '',
        medicalConditions: ''
      });
    }
    
    // Add children
    for (let i = 0; i < childCount; i++) {
      newTravelers.push({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        type: 'child',
        dietaryRequirements: '',
        medicalConditions: ''
      });
    }
    
    setTravelers(newTravelers);
  };

  // Update traveler counts
  const updateCounts = (newAdults: number, newChildren: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    initializeTravelers(newAdults, newChildren);
  };

  // Calculate total price (simplified - you'd want more complex pricing logic)
  const calculateTotalPrice = () => {
    const basePrice = tour.priceFrom;
    const adultPrice = basePrice * adults;
    const childPrice = (basePrice * 0.7) * children; // 30% discount for children
    return Math.round(adultPrice + childPrice);
  };

  // Handle payment success
  const handlePaymentSuccess = (reference: string, verificationData: any) => {
    console.log('✅ Payment successful:', { reference, verificationData });
    setPaymentReference(reference);
    setPaymentVerified(true);
    
    // Automatically proceed to booking creation after successful payment
    setTimeout(() => {
      handleSubmit();
    }, 1000);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.error('❌ Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (paymentMethod === 'online' && !paymentVerified) {
      alert('Please complete online payment before booking');
      return;
    }

    if (paymentMethod === 'cash' && !cashPaymentReceipt) {
      alert('Please upload your payment receipt before completing the booking');
      return;
    }

    try {
      // Calculate end date based on tour duration
      const startDate = new Date(selectedDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + tour.duration);

      // Transform travelers data to match GraphQL schema
      const transformedTravelers: BookingTraveler[] = travelers
        .filter(t => t.firstName && t.lastName)
        .map(traveler => {
          // Calculate age from date of birth
          let age = 25; // Default age
          if (traveler.dateOfBirth) {
            const birthDate = new Date(traveler.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }

          return {
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            age: age,
            passportNumber: traveler.passportNumber || '',
            dietaryRequirements: traveler.dietaryRequirements || ''
          };
        });

      const bookingInput: CreateBookingInput = {
        tourId: tour.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        adultsCount: adults,
        childrenCount: children,
        totalPrice: calculateTotalPrice(),
        customer: customerInfo,
        travelers: transformedTravelers,
        paymentMethod: paymentMethod === 'online' ? 'CARD' : 'CASH'
      };

      const result = await createBooking(bookingInput);
      
      if (result) {
        onBookingSuccess(result);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
    }
  };

  // Validation functions for each step
  const validateStep1 = (): boolean => {
    if (!selectedDate) {
      alert('Please select a tour date');
      return false;
    }
    if (adults < 1) {
      alert('At least one adult is required');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.firstName.trim()) {
        alert(`Please enter first name for traveler ${i + 1}`);
        return false;
      }
      if (!traveler.lastName.trim()) {
        alert(`Please enter last name for traveler ${i + 1}`);
        return false;
      }
      if (!traveler.dateOfBirth || !traveler.nationality || !traveler.passportNumber) {
        alert(`Please enter required information for traveler ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!customerInfo.firstName.trim()) {
      alert('Please enter your first name');
      return false;
    }
    if (!customerInfo.lastName.trim()) {
      alert('Please enter your last name');
      return false;
    }
    if (!customerInfo.email.trim()) {
      alert('Please enter your email address');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    return true;
  };

  // Handle next step with validation
  const handleNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    { number: 1, title: 'Tour Details', icon: Calendar },
    { number: 2, title: 'Travelers', icon: Users },
    { number: 3, title: 'Contact Info', icon: User },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Book Your Adventure</h1>
        <p className="text-lg text-neutral-600">{tour.title}</p>
        <p className="text-neutral-500">{tour.destination.name}, {tour.destination.country.name}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= step.number 
                ? 'bg-primary-600 text-white' 
                : 'bg-neutral-200 text-neutral-600'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.number ? 'text-primary-600' : 'text-neutral-600'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Booking Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6">Tour Details</h3>
            
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Departure Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Traveler Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Adults (18+) *
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => updateCounts(Math.max(1, adults - 1), children)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    type="button"
                    onClick={() => updateCounts(adults + 1, children)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Children (0-17)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => updateCounts(adults, Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <button
                    type="button"
                    onClick={() => updateCounts(adults, children + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-neutral-900 mb-2">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Adults ({adults}) × {formatPrice(tour.priceFrom)}</span>
                  <span>{formatPrice(tour.priceFrom * adults)}</span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({children}) × {formatPrice(Math.round(tour.priceFrom * 0.7))}</span>
                    <span>{formatPrice(Math.round(tour.priceFrom * 0.7) * children)}</span>
                  </div>
                )}
                <div className="border-t pt-1 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPriceWithConversionSync(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6">Traveler Information</h3>
            <div className="space-y-6">
              {travelers.map((traveler, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-4">
                    {index < adults ? 'Adult' : 'Child'} {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={traveler.firstName}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].firstName = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={traveler.lastName}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].lastName = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].dateOfBirth = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Nationality *
                      </label>
                      <input
                        type="text"
                        value={traveler.nationality}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].nationality = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Passport Number *
                      </label>
                      <input
                        type="text"
                        value={traveler.passportNumber}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].passportNumber = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Dietary Requirements
                      </label>
                      <input
                        type="text"
                        value={traveler.dietaryRequirements || ''}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].dietaryRequirements = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        placeholder="e.g., Vegetarian, Gluten-free, No nuts"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Medical Conditions
                      </label>
                      <input
                        type="text"
                        value={traveler.medicalConditions || ''}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].medicalConditions = e.target.value;
                          setTravelers(newTravelers);
                        }}
                        placeholder="e.g., Diabetes, Epilepsy, Allergies"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.firstName}
                  onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.lastName}
                  onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={customerInfo.nationality || ''}
                  onChange={(e) => setCustomerInfo({...customerInfo, nationality: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={customerInfo.emergencyContact || ''}
                  onChange={(e) => setCustomerInfo({...customerInfo, emergencyContact: e.target.value})}
                  placeholder="+233 24 123 4567"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Complete Payment
              </h3>
              <p className="text-neutral-600">
                Secure payment processing with Paystack
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'online' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    <div>
                      <span className="font-medium text-neutral-900">Online Payment</span>
                      <p className="text-sm text-neutral-600">Pay securely with Paystack</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Banknote className="w-5 h-5 mr-2 text-primary-600" />
                    <div>
                      <span className="font-medium text-neutral-900">Bank Transfer</span>
                      <p className="text-sm text-neutral-600">Pay via bank transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-neutral-50 rounded-lg p-6">
              <h4 className="font-semibold text-neutral-900 mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tour:</span>
                  <span className="font-medium">{tour.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Adults:</span>
                  <span className="font-medium">{adults}</span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Children:</span>
                    <span className="font-medium">{children}</span>
                  </div>
                )}
                <div className="border-t pt-1 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatPriceWithConversionSync(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {paymentVerified && paymentReference && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">Payment Successful!</p>
                    <p className="text-green-600 text-sm">Reference: {paymentReference}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Paystack Payment Button */}
            {paymentMethod === 'online' && !paymentVerified && (
              <PaystackPayment
                email={customerInfo.email}
                amount={calculateTotalPrice()} // Amount in USD
                currency="GHS"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                metadata={{
                  tour_id: tour.id,
                  adults,
                  children,
                  selected_date: selectedDate
                }}
                buttonText={`Pay ${formatPriceWithConversionSync(calculateTotalPrice())}`}
                className="w-full"
              />
            )}

            {/* Cash Payment Instructions */}
            {paymentMethod === 'cash' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-3">Bank Transfer Payment Instructions</h4>
                    <p className="text-blue-800 mb-4">
                      Please transfer the total amount of <strong>{formatPriceWithConversionSync(calculateTotalPrice())}</strong> to our bank account:
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm font-medium text-neutral-600">Account Name:</span>
                          <p className="font-semibold text-neutral-900">Travel Addicts Ghana Ltd</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-600">Account Number:</span>
                          <p className="font-semibold text-neutral-900">1234567890</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-600">Bank Name:</span>
                          <p className="font-semibold text-neutral-900">Ecobank Ghana</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neutral-600">Branch:</span>
                          <p className="font-semibold text-neutral-900">Accra Main Branch</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-blue-800 font-medium mb-2">Important Notes:</p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Use your booking reference as the transfer description</li>
                        <li>• Keep your payment receipt for verification</li>
                        <li>• Upload a clear photo or scan of your receipt below</li>
                        <li>• Your booking will be confirmed once payment is verified</li>
                      </ul>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Upload Payment Receipt *
                      </label>
                      <input
                        type="file"
                        accept=".pdf, .jpg, .jpeg, .png"
                        onChange={(e) => setCashPaymentReceipt(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      />
                      {cashPaymentReceipt && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Receipt uploaded: {cashPaymentReceipt.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Booking'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
