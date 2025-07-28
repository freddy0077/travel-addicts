'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Globe,
  Activity
} from 'lucide-react';
import { 
  getExchangeRateStatus, 
  formatPrice, 
  convertUsdToGhs, 
  convertUsdToGhsSync,
  FALLBACK_EXCHANGE_RATES 
} from '@/lib/currency';
import { 
  getExchangeRate, 
  clearCache, 
  getCacheStatus 
} from '@/lib/exchange-rates';

export default function CurrencyMonitor() {
  const [status, setStatus] = useState(getExchangeRateStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [conversionTest, setConversionTest] = useState({
    usd: 100,
    ghsLive: 0,
    ghsFallback: convertUsdToGhsSync(100)
  });

  useEffect(() => {
    loadLiveRate();
    const interval = setInterval(() => {
      setStatus(getExchangeRateStatus());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadLiveRate = async () => {
    try {
      const rate = await getExchangeRate('USD', 'GHS');
      setLiveRate(rate);
      
      // Update conversion test
      const ghsLive = await convertUsdToGhs(conversionTest.usd);
      setConversionTest(prev => ({
        ...prev,
        ghsLive
      }));
    } catch (error) {
      console.error('Failed to load live rate:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      clearCache();
      await loadLiveRate();
      setStatus(getExchangeRateStatus());
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTestAmountChange = async (newAmount: number) => {
    const ghsFallback = convertUsdToGhsSync(newAmount);
    let ghsLive = ghsFallback;
    
    try {
      ghsLive = await convertUsdToGhs(newAmount);
    } catch (error) {
      console.error('Failed to convert with live rate:', error);
    }

    setConversionTest({
      usd: newAmount,
      ghsLive,
      ghsFallback
    });
  };

  const rateDifference = liveRate && liveRate !== FALLBACK_EXCHANGE_RATES.USD_TO_GHS 
    ? ((liveRate - FALLBACK_EXCHANGE_RATES.USD_TO_GHS) / FALLBACK_EXCHANGE_RATES.USD_TO_GHS * 100).toFixed(2)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Currency Monitor</h2>
          <p className="text-neutral-600">Real-time exchange rate monitoring and testing</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* API Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <div className="flex items-center space-x-3">
            {status.apiEnabled ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            )}
            <div>
              <h3 className="font-semibold text-neutral-900">API Status</h3>
              <p className="text-sm text-neutral-600">
                {status.apiEnabled ? 'Connected' : 'Not Configured'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cache Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-neutral-900">Cache Status</h3>
              <p className="text-sm text-neutral-600">
                {status.cached ? `${Math.floor((status.expiresIn || 0) / 60)}m remaining` : 'Not cached'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-neutral-900">USD → GHS</h3>
              <p className="text-sm text-neutral-600">
                {liveRate ? liveRate.toFixed(2) : FALLBACK_EXCHANGE_RATES.USD_TO_GHS} GHS
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rate Difference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className={`h-8 w-8 ${rateDifference && parseFloat(rateDifference) > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <h3 className="font-semibold text-neutral-900">vs Fallback</h3>
              <p className="text-sm text-neutral-600">
                {rateDifference ? `${rateDifference}%` : 'Same rate'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conversion Testing */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Conversion Testing</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Test Amount (USD)
            </label>
            <input
              type="number"
              value={conversionTest.usd}
              onChange={(e) => handleTestAmountChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter USD amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Live Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatPrice(conversionTest.ghsLive, 'GHS')}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Using Open Exchange Rates API
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Fallback Rate</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">
                {formatPrice(conversionTest.ghsFallback, 'GHS')}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Static rate: {FALLBACK_EXCHANGE_RATES.USD_TO_GHS} GHS
              </p>
            </div>
          </div>

          {conversionTest.ghsLive !== conversionTest.ghsFallback && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Difference Analysis</h4>
              <div className="text-sm text-blue-800">
                <p>
                  <strong>Amount difference:</strong> {formatPrice(Math.abs(conversionTest.ghsLive - conversionTest.ghsFallback), 'GHS')}
                </p>
                <p>
                  <strong>Percentage difference:</strong> {(Math.abs(conversionTest.ghsLive - conversionTest.ghsFallback) / conversionTest.ghsFallback * 100).toFixed(2)}%
                </p>
                <p className="mt-2 text-xs">
                  {conversionTest.ghsLive > conversionTest.ghsFallback 
                    ? '📈 Live rate is higher than fallback' 
                    : '📉 Live rate is lower than fallback'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-neutral-900 mb-2">Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">API Enabled:</span>
                <span className={status.apiEnabled ? 'text-green-600' : 'text-red-600'}>
                  {status.apiEnabled ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Fallback Rate:</span>
                <span className="text-neutral-900">{FALLBACK_EXCHANGE_RATES.USD_TO_GHS} GHS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Cache Duration:</span>
                <span className="text-neutral-900">1 hour</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-2">Last Update</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Cache Updated:</span>
                <span className="text-neutral-900">
                  {status.lastUpdated?.toLocaleString() || 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Manual Refresh:</span>
                <span className="text-neutral-900">{lastRefresh.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
