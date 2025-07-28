/**
 * Currency conversion utilities with Open Exchange Rates API integration
 * Provides real-time exchange rates with static fallback
 */

import { getExchangeRate, convertCurrency, getCacheStatus } from './exchange-rates';

export type Currency = 'USD' | 'GHS' | 'EUR' | 'GBP' | 'CAD';

export interface CurrencyRates {
  USD_TO_GHS: number;
  GHS_TO_USD: number;
}

export interface PaymentConversion {
  originalAmount: number;
  originalCurrency: Currency;
  paymentAmount: number;
  paymentCurrency: Currency;
  exchangeRate: number;
  conversionInfo: string;
}

// Static fallback rates (used when API is unavailable)
export const FALLBACK_EXCHANGE_RATES: CurrencyRates = {
  USD_TO_GHS: 15.5,        // 1 USD = 15.5 GHS
  GHS_TO_USD: 1 / 15.5     // 1 GHS = ~0.065 USD
};

/**
 * Convert USD to GHS using live exchange rates
 */
export const convertUsdToGhs = async (usdAmount: number): Promise<number> => {
  try {
    return await convertCurrency(usdAmount, 'USD', 'GHS');
  } catch (error) {
    console.error('Failed to convert USD to GHS, using fallback rate:', error);
    return Math.round(usdAmount * FALLBACK_EXCHANGE_RATES.USD_TO_GHS);
  }
};

/**
 * Convert GHS to USD using live exchange rates
 */
export const convertGhsToUsd = async (ghsAmount: number): Promise<number> => {
  try {
    return await convertCurrency(ghsAmount, 'GHS', 'USD');
  } catch (error) {
    console.error('Failed to convert GHS to USD, using fallback rate:', error);
    return Math.round((ghsAmount * FALLBACK_EXCHANGE_RATES.GHS_TO_USD) * 100) / 100;
  }
};

/**
 * Synchronous conversion using static rates (for immediate UI updates)
 */
export const convertUsdToGhsSync = (usdAmount: number): number => {
  return Math.round(usdAmount * FALLBACK_EXCHANGE_RATES.USD_TO_GHS);
};

export const convertGhsToUsdSync = (ghsAmount: number): number => {
  return Math.round((ghsAmount * FALLBACK_EXCHANGE_RATES.GHS_TO_USD) * 100) / 100;
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount: number, currency: Currency = 'USD'): string => {
  const formatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'USD' ? 0 : 0
  };

  switch (currency) {
    case 'USD':
      return `$${amount.toLocaleString('en-US', formatOptions)}`;
    case 'GHS':
      return `GH₵${amount.toLocaleString('en-US', formatOptions)}`;
    case 'EUR':
      return `€${amount.toLocaleString('en-US', formatOptions)}`;
    case 'GBP':
      return `£${amount.toLocaleString('en-US', formatOptions)}`;
    case 'CAD':
      return `C$${amount.toLocaleString('en-US', formatOptions)}`;
    default:
      return `${currency}${amount.toLocaleString('en-US', formatOptions)}`;
  }
};

/**
 * Format price with conversion info (async version with live rates)
 */
export const formatPriceWithConversion = async (usdAmount: number): Promise<string> => {
  try {
    const ghsAmount = await convertUsdToGhs(usdAmount);
    return `${formatPrice(usdAmount, 'USD')} (≈ ${formatPrice(ghsAmount, 'GHS')})`;
  } catch (error) {
    // Fallback to sync conversion
    const ghsAmount = convertUsdToGhsSync(usdAmount);
    return `${formatPrice(usdAmount, 'USD')} (≈ ${formatPrice(ghsAmount, 'GHS')})`;
  }
};

/**
 * Format price with conversion info (sync version for immediate UI)
 */
export const formatPriceWithConversionSync = (usdAmount: number): string => {
  const ghsAmount = convertUsdToGhsSync(usdAmount);
  return `${formatPrice(usdAmount, 'USD')} (≈ ${formatPrice(ghsAmount, 'GHS')})`;
};

/**
 * Prepare payment conversion with live exchange rates
 */
export const preparePaymentConversion = async (usdAmount: number): Promise<PaymentConversion> => {
  try {
    const exchangeRate = await getExchangeRate('USD', 'GHS');
    const ghsAmount = Math.round(usdAmount * exchangeRate);
    
    return {
      originalAmount: usdAmount,
      originalCurrency: 'USD',
      paymentAmount: ghsAmount,
      paymentCurrency: 'GHS',
      exchangeRate: exchangeRate,
      conversionInfo: `${formatPrice(usdAmount, 'USD')} = ${formatPrice(ghsAmount, 'GHS')} (Rate: 1 USD = ${exchangeRate.toFixed(2)} GHS)`
    };
  } catch (error) {
    console.error('Failed to prepare payment conversion with live rates, using fallback:', error);
    return preparePaymentConversionSync(usdAmount);
  }
};

/**
 * Prepare payment conversion with static rates (fallback)
 */
export const preparePaymentConversionSync = (usdAmount: number): PaymentConversion => {
  const ghsAmount = convertUsdToGhsSync(usdAmount);
  
  return {
    originalAmount: usdAmount,
    originalCurrency: 'USD',
    paymentAmount: ghsAmount,
    paymentCurrency: 'GHS',
    exchangeRate: FALLBACK_EXCHANGE_RATES.USD_TO_GHS,
    conversionInfo: `${formatPrice(usdAmount, 'USD')} = ${formatPrice(ghsAmount, 'GHS')} (Rate: 1 USD = ${FALLBACK_EXCHANGE_RATES.USD_TO_GHS} GHS)`
  };
};

/**
 * Get current exchange rate status for debugging
 */
export const getExchangeRateStatus = () => {
  const cacheStatus = getCacheStatus();
  return {
    ...cacheStatus,
    fallbackRate: FALLBACK_EXCHANGE_RATES.USD_TO_GHS,
    apiEnabled: !!process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY
  };
};
