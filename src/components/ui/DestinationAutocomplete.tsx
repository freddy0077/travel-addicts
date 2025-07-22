'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { graphqlClient, SEARCH_DESTINATIONS_QUERY } from '@/lib/graphql-client';
import { cn } from '@/lib/utils';

interface Destination {
  id: string;
  name: string;
  country: {
    name: string;
  };
  type: string;
}

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onDestinationSelect?: (destination: Destination) => void;
}

export default function DestinationAutocomplete({
  value,
  onChange,
  placeholder = "Where would you like to go?",
  className,
  onDestinationSelect
}: DestinationAutocompleteProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const searchDestinations = async () => {
      if (!value.trim() || value.length < 2) {
        setFilteredDestinations([]);
        setIsLoading(false);
        setSelectedIndex(-1);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔍 Searching destinations for:', value);
        
        const result = await graphqlClient.request<{ 
          searchDestinations: { 
            destinations: Destination[] 
          } 
        }>(
          SEARCH_DESTINATIONS_QUERY,
          { 
            query: value,
            limit: 10
          }
        );
        
        console.log('📍 Search results:', result);
        const searchResults = result.searchDestinations?.destinations || [];
        setFilteredDestinations(searchResults);
        setSelectedIndex(-1);
        
      } catch (error) {
        console.error('❌ Error searching destinations:', error);
        // Fallback destinations for development/testing
        const fallbackDestinations = [
          {
            id: '1',
            name: 'Accra',
            country: { name: 'Ghana' },
            type: 'City'
          },
          {
            id: '2',
            name: 'Cape Coast',
            country: { name: 'Ghana' },
            type: 'Coastal'
          },
          {
            id: '3',
            name: 'Kumasi',
            country: { name: 'Ghana' },
            type: 'City'
          },
          {
            id: '4',
            name: 'Busua Beach',
            country: { name: 'Ghana' },
            type: 'Beach'
          },
          {
            id: '5',
            name: 'Kakum National Park',
            country: { name: 'Ghana' },
            type: 'Nature'
          }
        ].filter(dest => 
          dest.name.toLowerCase().includes(value.toLowerCase()) ||
          dest.country.name.toLowerCase().includes(value.toLowerCase())
        );
        
        setFilteredDestinations(fallbackDestinations);
        setSelectedIndex(-1);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchDestinations, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  // Handle destination selection
  const handleDestinationSelect = (destination: Destination) => {
    onChange(destination.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onDestinationSelect) {
      onDestinationSelect(destination);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredDestinations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredDestinations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredDestinations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleDestinationSelect(filteredDestinations[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
            className
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 animate-spin" />
        )}
        {!isLoading && value && (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredDestinations.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {filteredDestinations.map((destination, index) => (
              <motion.button
                key={destination.id}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleDestinationSelect(destination)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center space-x-3 border-b border-neutral-100 last:border-b-0",
                  selectedIndex === index && "bg-primary-50"
                )}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {destination.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {destination.country.name} • {destination.type}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {isOpen && value.trim() && filteredDestinations.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg p-4"
          >
            <div className="text-center text-neutral-500">
              <Search className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
              <p className="text-sm">No destinations found for "{value}"</p>
              <p className="text-xs mt-1">Try searching for a different location</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
