import { useState } from 'react';
import { graphqlClient, CREATE_BOOKING_MUTATION, CANCEL_BOOKING_MUTATION } from '@/lib/graphql-client';

export interface BookingCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: string;
  dietaryRequirements?: string;
  medicalConditions?: string;
}

export interface BookingTraveler {
  firstName: string;
  lastName: string;
  age: number;
  passportNumber?: string;
  dietaryRequirements?: string;
}

export interface CreateBookingInput {
  tourId: string;
  selectedDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  customer: BookingCustomer;
  travelers: BookingTraveler[];
  paymentReference: string;
}

export interface BookingResult {
  id: string;
  bookingReference: string;
  tour: {
    id: string;
    title: string;
    destination: {
      name: string;
      country: {
        name: string;
      };
    };
  };
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  startDate: string;
  endDate: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  travelers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    passportNumber?: string;
    dietaryRequirements?: string;
  }>;
  createdAt: string;
}

export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const createBooking = async (input: CreateBookingInput): Promise<BookingResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🎯 Creating booking with input:', input);

      const result = await graphqlClient.request<{ createBooking: BookingResult }>(
        CREATE_BOOKING_MUTATION,
        { input }
      );

      console.log('✅ Booking created successfully:', result.createBooking);
      
      setBookingResult(result.createBooking);
      return result.createBooking;
    } catch (err: any) {
      console.error('❌ Booking creation failed:', err);
      const errorMessage = err.message || 'Failed to create booking';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚫 Canceling booking:', bookingId);

      await graphqlClient.request(CANCEL_BOOKING_MUTATION, { id: bookingId });

      console.log('✅ Booking canceled successfully');
      return true;
    } catch (err: any) {
      console.error('❌ Booking cancellation failed:', err);
      const errorMessage = err.message || 'Failed to cancel booking';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingResult(null);
    setError(null);
  };

  return {
    createBooking,
    cancelBooking,
    resetBooking,
    isLoading,
    error,
    bookingResult
  };
}
