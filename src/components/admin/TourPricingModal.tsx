'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Calendar, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { graphqlClient, TOUR_PRICING_QUERY, CREATE_TOUR_PRICING_MUTATION, DELETE_TOUR_PRICING_MUTATION, convertPesewasToCedis } from '@/lib/graphql-client'

interface TourPricing {
  id: string
  season: string
  priceAdult: number
  priceChild: number
  availableDates: string[]
  maxCapacity: number
}

interface TourPricingModalProps {
  isOpen: boolean
  onClose: () => void
  tourId: string
  tourTitle: string
  onPricingUpdated?: () => void
}

export default function TourPricingModal({
  isOpen,
  onClose,
  tourId,
  tourTitle,
  onPricingUpdated
}: TourPricingModalProps) {
  const [pricingData, setPricingData] = useState<TourPricing[]>([])
  const [loading, setLoading] = useState(false)
  const [newPricing, setNewPricing] = useState({
    season: '',
    priceAdult: '',
    priceChild: '',
    availableDates: [''],
    maxCapacity: ''
  })

  const fetchPricingData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await graphqlClient.request<{
        tourPricing: TourPricing[]
      }>(TOUR_PRICING_QUERY, { tourId })
      
      setPricingData(result.tourPricing || [])
    } catch (error) {
      console.error('Error fetching pricing data:', error)
    } finally {
      setLoading(false)
    }
  }, [tourId])

  useEffect(() => {
    if (isOpen && tourId) {
      fetchPricingData()
    }
  }, [isOpen, tourId, fetchPricingData])

  const addDateField = useCallback(() => {
    setNewPricing(prev => ({
      ...prev,
      availableDates: [...prev.availableDates, '']
    }))
  }, [])

  const removeDateField = useCallback((index: number) => {
    setNewPricing(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }))
  }, [])

  const updateDateField = useCallback((index: number, value: string) => {
    setNewPricing(prev => ({
      ...prev,
      availableDates: prev.availableDates.map((date, i) => i === index ? value : date)
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await graphqlClient.request(CREATE_TOUR_PRICING_MUTATION, {
        input: {
          tourId,
          season: newPricing.season,
          priceAdult: parseInt(newPricing.priceAdult),
          priceChild: parseInt(newPricing.priceChild),
          availableDates: newPricing.availableDates.filter(date => date.trim() !== ''),
          maxCapacity: parseInt(newPricing.maxCapacity)
        }
      })
      
      // Reset form
      setNewPricing({
        season: '',
        priceAdult: '',
        priceChild: '',
        availableDates: [''],
        maxCapacity: ''
      })
      
      // Refresh data
      await fetchPricingData()
      onPricingUpdated?.()
    } catch (error) {
      console.error('Error creating pricing:', error)
      alert('Error creating pricing. Please try again.')
    }
  }

  const deletePricing = async (pricingId: string) => {
    if (!confirm('Are you sure you want to delete this pricing?')) return
    
    try {
      await graphqlClient.request(DELETE_TOUR_PRICING_MUTATION, { id: pricingId })
      
      // Refresh data
      await fetchPricingData()
      onPricingUpdated?.()
    } catch (error) {
      console.error('Error deleting pricing:', error)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Manage Tour Pricing</h2>
              <p className="text-neutral-600 mt-1">{tourTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Existing Pricing */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Pricing</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-neutral-600 mt-2">Loading pricing data...</p>
                </div>
              ) : pricingData.length > 0 ? (
                <div className="space-y-4">
                  {pricingData.map((pricing) => (
                    <div key={pricing.id} className="border border-neutral-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <DollarSign className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-900">{pricing.season} Season</h4>
                            <p className="text-sm text-neutral-600">
                              Adult: {formatPrice(convertPesewasToCedis(pricing.priceAdult))} | 
                              Child: {formatPrice(convertPesewasToCedis(pricing.priceChild))} | 
                              Max: {pricing.maxCapacity} people
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deletePricing(pricing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pricing.availableDates.map((date, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                          >
                            {new Date(date).toLocaleDateString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-neutral-200 rounded-xl">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No pricing data found</p>
                  <p className="text-sm text-neutral-500">Add pricing information below</p>
                </div>
              )}
            </div>

            {/* Add New Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add New Pricing</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Season
                    </label>
                    <select
                      value={newPricing.season}
                      onChange={(e) => setNewPricing(prev => ({ ...prev, season: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select season</option>
                      <option value="Low">Low Season</option>
                      <option value="High">High Season</option>
                      <option value="Peak">Peak Season</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      value={newPricing.maxCapacity}
                      onChange={(e) => setNewPricing(prev => ({ ...prev, maxCapacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Adult Price (GH₵)
                    </label>
                    <input
                      type="number"
                      value={newPricing.priceAdult}
                      onChange={(e) => setNewPricing(prev => ({ ...prev, priceAdult: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Child Price (GH₵)
                    </label>
                    <input
                      type="number"
                      value={newPricing.priceChild}
                      onChange={(e) => setNewPricing(prev => ({ ...prev, priceChild: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Available Dates
                  </label>
                  <div className="space-y-2">
                    {newPricing.availableDates.map((date, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => updateDateField(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                        {newPricing.availableDates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDateField(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDateField}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add another date
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Add Pricing
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
