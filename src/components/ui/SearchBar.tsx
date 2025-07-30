'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users, Sparkles, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomBookingModal from './CustomBookingModal'
import DestinationAutocomplete from './DestinationAutocomplete'
import { SearchFilters } from '@/hooks/useSearch'

interface SearchBarProps {
  className?: string
  variant?: 'hero' | 'compact'
  onSearch?: (searchData: SearchFilters) => void
}

export default function SearchBar({ className, variant = 'hero', onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isCustomBookingModalOpen, setIsCustomBookingModalOpen] = useState(false)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const searchData: SearchFilters = {
      query: destination || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      adults: adults > 0 ? adults : undefined,
      children: children > 0 ? children : undefined
    }
    
    console.log('SearchBar search data:', searchData)
    if (onSearch) {
      onSearch(searchData)
    }
  }

  // Format date for display
  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Select dates'
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${start} - ${end}`
    }
    if (startDate) {
      return new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return 'Select dates'
  }

  // Format travelers for display
  const formatTravelers = () => {
    let text = `${adults} Adult${adults !== 1 ? 's' : ''}`
    if (children > 0) {
      text += `, ${children} Child${children !== 1 ? 'ren' : ''}`
    }
    return text
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('relative', className)}
      >
        <form onSubmit={handleSearch} className="flex items-center space-x-3">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <DestinationAutocomplete
                value={destination}
                onChange={(value) => setDestination(value)}
                placeholder="Where to?"
                className="border-0 bg-transparent backdrop-blur-none shadow-none"
              />
            </div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </div>
          </motion.button>
        </form>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        'relative group',
        className
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl" />
      
      {/* Content */}
      <div className="relative p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-2 mb-3"
          >
            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
              Find Your Perfect Adventure
            </h3>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-neutral-700 text-sm font-medium"
          >
            Discover amazing destinations and create unforgettable memories
          </motion.p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Destination */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-900">
                <div className="p-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Destination</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <DestinationAutocomplete
                    value={destination}
                    onChange={(value) => setDestination(value)}
                    placeholder="Where would you like to go?"
                    className="bg-white/80 backdrop-blur-sm border border-white/30 hover:bg-white/90 focus:bg-white/100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Dates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-900">
                <div className="p-1.5 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Travel Dates</span>
              </label>
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white/100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white/100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Travelers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-900">
                <div className="p-1.5 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Travelers</span>
              </label>
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white/100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                    <option value="5">5+ Adults</option>
                  </select>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="relative w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-300 focus:bg-white/100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="0">0 Children</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                    <option value="3">3 Children</option>
                    <option value="4">4+ Children</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-secondary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-3 px-8 py-4 text-white font-semibold shadow-xl">
                <Search className="w-5 h-5" />
                <span>Search Adventures</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCustomBookingModalOpen(true)}
              className="relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-2 px-6 py-4 text-neutral-700 font-semibold">
                <Edit className="w-4 h-4" />
                <span>Request Custom Trip</span>
              </div>
            </motion.button>
          </motion.div>
        </form>
      </div>

      <CustomBookingModal
        isOpen={isCustomBookingModalOpen}
        onClose={() => setIsCustomBookingModalOpen(false)}
      />
    </motion.div>
  )
}
