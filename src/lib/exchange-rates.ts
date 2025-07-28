/**
 * Open Exchange Rates API Integration
 * Provides real-time currency exchange rates with caching and fallback
 */

export interface ExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

export interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
  expiresAt: number;
}

// Cache duration: 1 hour (3600 seconds)
const CACHE_DURATION = 3600 * 1000;

// In-memory cache for exchange rates
let cachedRates: CachedRates | null = null;

// Static fallback rates (used when API is unavailable)
const FALLBACK_RATES = {
  GHS: 15.5,  // 1 USD = 15.5 GHS
  EUR: 0.85,  // 1 USD = 0.85 EUR
  GBP: 0.73,  // 1 USD = 0.73 GBP
  CAD: 1.25,  // 1 USD = 1.25 CAD
};

/**
 * Fetch live exchange rates from Open Exchange Rates API
 */
export async function fetchLiveExchangeRates(): Promise<Record<string, number>> {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY;
  
  if (!apiKey) {
    console.warn('Open Exchange Rates API key not found, using fallback rates');
    return FALLBACK_RATES;
  }

  try {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ExchangeRatesResponse = await response.json();
    
    if (!data.rates || typeof data.rates !== 'object') {
      throw new Error('Invalid API response format');
    }

    console.log(`✅ Fetched live exchange rates (${Object.keys(data.rates).length} currencies)`);
    return data.rates;

  } catch (error) {
    console.error('❌ Failed to fetch live exchange rates:', error);
    console.log('🔄 Falling back to static rates');
    return FALLBACK_RATES;
  }
}

/**
 * Get exchange rates with caching
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();

  // Check if cached rates are still valid
  if (cachedRates && now < cachedRates.expiresAt) {
    console.log('📦 Using cached exchange rates');
    return cachedRates.rates;
  }

  // Fetch fresh rates
  console.log('🔄 Fetching fresh exchange rates...');
  const rates = await fetchLiveExchangeRates();

  // Cache the rates
  cachedRates = {
    rates,
    timestamp: now,
    expiresAt: now + CACHE_DURATION,
  };

  return rates;
}

/**
 * Get specific exchange rate between two currencies
 */
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rates = await getExchangeRates();

  // Open Exchange Rates uses USD as base, so we need to convert
  if (fromCurrency === 'USD') {
    return rates[toCurrency] || FALLBACK_RATES[toCurrency as keyof typeof FALLBACK_RATES] || 1;
  }

  if (toCurrency === 'USD') {
    const rate = rates[fromCurrency] || FALLBACK_RATES[fromCurrency as keyof typeof FALLBACK_RATES];
    return rate ? 1 / rate : 1;
  }

  // For non-USD pairs, convert through USD
  const fromRate = rates[fromCurrency] || FALLBACK_RATES[fromCurrency as keyof typeof FALLBACK_RATES] || 1;
  const toRate = rates[toCurrency] || FALLBACK_RATES[toCurrency as keyof typeof FALLBACK_RATES] || 1;
  
  return toRate / fromRate;
}

/**
 * Convert amount between currencies
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus(): { cached: boolean; expiresIn?: number; lastUpdated?: Date } {
  if (!cachedRates) {
    return { cached: false };
  }

  const now = Date.now();
  const expiresIn = Math.max(0, cachedRates.expiresAt - now);
  
  return {
    cached: true,
    expiresIn: Math.floor(expiresIn / 1000), // seconds
    lastUpdated: new Date(cachedRates.timestamp),
  };
}

/**
 * Clear cache (useful for testing or forcing refresh)
 */
export function clearCache(): void {
  cachedRates = null;
  console.log('🗑️ Exchange rates cache cleared');
}
