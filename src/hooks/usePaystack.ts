import { useState } from 'react';
import { graphqlClient, PAYSTACK_INITIALIZE_MUTATION, PAYSTACK_VERIFY_MUTATION } from '@/lib/graphql-client';

interface PaystackInitializeInput {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: string;
}

interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaystackVerifyData {
  reference: string;
  amount: number;
  status: string;
  gateway_response: string;
  paid_at: string | null;
  created_at: string;
  channel: string;
  currency: string;
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
  };
}

interface PaystackResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export function usePaystack() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (input: PaystackInitializeInput): Promise<PaystackInitializeData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Initializing Paystack payment:', {
        email: input.email,
        amount: input.amount,
        currency: input.currency || 'GHS'
      });

      const result = await graphqlClient.request<{
        paystackInitialize: PaystackResponse<PaystackInitializeData>
      }>(PAYSTACK_INITIALIZE_MUTATION, { input });

      if (result.paystackInitialize.success && result.paystackInitialize.data) {
        console.log('✅ Payment initialization successful:', result.paystackInitialize.data);
        return result.paystackInitialize.data;
      } else {
        throw new Error(result.paystackInitialize.message || 'Payment initialization failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to initialize payment';
      console.error('❌ Payment initialization error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string): Promise<PaystackVerifyData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Verifying Paystack payment:', reference);

      const result = await graphqlClient.request<{
        paystackVerify: PaystackResponse<PaystackVerifyData>
      }>(PAYSTACK_VERIFY_MUTATION, { reference });

      if (result.paystackVerify.success && result.paystackVerify.data) {
        console.log('✅ Payment verification successful:', {
          reference,
          status: result.paystackVerify.data.status,
          amount: result.paystackVerify.data.amount
        });
        return result.paystackVerify.data;
      } else {
        throw new Error(result.paystackVerify.message || 'Payment verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to verify payment';
      console.error('❌ Payment verification error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert pesewas to kobo for Paystack
  const convertPesewasToKobo = (pesewas: number): number => {
    return pesewas; // 1 pesewa = 1 kobo (both are 1/100 of main currency)
  };

  // Helper function to convert kobo to pesewas
  const convertKoboToPesewas = (kobo: number): number => {
    return kobo; // 1 kobo = 1 pesewa (both are 1/100 of main currency)
  };

  // Generate a unique payment reference
  const generateReference = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TRA_${timestamp}_${random}`.toUpperCase();
  };

  return {
    initializePayment,
    verifyPayment,
    convertPesewasToKobo,
    convertKoboToPesewas,
    generateReference,
    isLoading,
    error,
  };
}

export default usePaystack;
