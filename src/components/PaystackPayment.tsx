'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Loader, CheckCircle, XCircle } from 'lucide-react';
import usePaystack from '@/hooks/usePaystack';

interface PaystackPaymentProps {
  email: string;
  amount: number; // Amount in pesewas
  currency?: string;
  onSuccess: (reference: string, verificationData: any) => void;
  onError: (error: string) => void;
  onClose?: () => void;
  metadata?: any;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackPayment({
  email,
  amount,
  currency = 'GHS',
  onSuccess,
  onError,
  onClose,
  metadata,
  disabled = false,
  buttonText = 'Pay Now',
  className = ''
}: PaystackPaymentProps) {
  const { initializePayment, verifyPayment, convertPesewasToKobo, generateReference, isLoading, error } = usePaystack();
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initializing' | 'processing' | 'verifying' | 'success' | 'error'>('idle');

  // Load Paystack Inline script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Paystack Inline script loaded');
      setIsPaystackLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      onError('Failed to load payment system');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCallback = (response: any) => {
    console.log('✅ Payment successful:', response);
    setPaymentStatus('verifying');
    
    verifyPayment(response.reference).then((verificationData) => {
      if (verificationData && verificationData.status === 'success') {
        setPaymentStatus('success');
        onSuccess(response.reference, verificationData);
      } else {
        setPaymentStatus('error');
        onError('Payment verification failed');
      }
    }).catch((verifyError: any) => {
      console.error('❌ Payment verification error:', verifyError);
      setPaymentStatus('error');
      onError(verifyError.message || 'Payment verification failed');
    });
  };

  const handleClose = () => {
    console.log('💔 Payment popup closed');
    setPaymentStatus('idle');
    if (onClose) {
      onClose();
    }
  };

  const handlePayment = async () => {
    if (!isPaystackLoaded || !window.PaystackPop) {
      onError('Payment system not loaded. Please refresh and try again.');
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      onError('Payment configuration error. Please contact support.');
      return;
    }

    try {
      setPaymentStatus('initializing');
      
      // Generate unique reference
      const reference = generateReference();
      
      // Convert amount to kobo for Paystack
      const amountInKobo = convertPesewasToKobo(amount);
      
      console.log('💰 Payment details:', {
        email,
        amount: amountInKobo,
        currency,
        reference
      });

      // Initialize payment with backend
      const initData = await initializePayment({
        email,
        amount: amountInKobo,
        currency,
        reference,
        metadata: metadata ? JSON.stringify(metadata) : undefined
      });

      if (!initData) {
        setPaymentStatus('error');
        return;
      }

      setPaymentStatus('processing');

      // Create Paystack configuration object
      const paystackConfig = {
        key: publicKey,
        email: email,
        amount: amountInKobo,
        currency: currency,
        ref: reference,
        metadata: metadata || {},
        callback: handleCallback,
        onClose: handleClose
      };

      console.log('🔧 Paystack config:', {
        ...paystackConfig,
        key: paystackConfig.key.substring(0, 10) + '...',
        callback: typeof paystackConfig.callback,
        onClose: typeof paystackConfig.onClose
      });

      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();
      
    } catch (error: any) {
      console.error('❌ Payment initialization error:', error);
      setPaymentStatus('error');
      onError(error.message || 'Payment initialization failed');
    }
  };

  const getButtonContent = () => {
    switch (paymentStatus) {
      case 'initializing':
        return (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Initializing...
          </>
        );
      case 'processing':
        return (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Processing...
          </>
        );
      case 'verifying':
        return (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment Successful
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="w-4 h-4 mr-2" />
            Payment Failed
          </>
        );
      default:
        return (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        );
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (paymentStatus) {
      case 'success':
        return `${baseStyles} bg-green-600 text-white`;
      case 'error':
        return `${baseStyles} bg-red-600 text-white`;
      default:
        return `${baseStyles} bg-primary-600 hover:bg-primary-700 text-white`;
    }
  };

  const isButtonDisabled = disabled || isLoading || !isPaystackLoaded || ['initializing', 'processing', 'verifying', 'success'].includes(paymentStatus);

  return (
    <div className={`paystack-payment ${className}`}>
      <button
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className={getButtonStyles()}
      >
        {getButtonContent()}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {!isPaystackLoaded && (
        <div className="mt-2 text-sm text-neutral-500">
          Loading payment system...
        </div>
      )}
    </div>
  );
}
