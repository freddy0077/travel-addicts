'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, MapPin, Utensils, Bed, Calendar, Save, AlertCircle } from 'lucide-react';
import { 
  graphqlClient, 
  CREATE_TOUR_ITINERARY_MUTATION, 
  UPDATE_TOUR_ITINERARY_MUTATION, 
  DELETE_TOUR_ITINERARY_MUTATION 
} from '@/lib/graphql-client';

interface ItineraryDay {
  id?: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string | null;
}

interface ItineraryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: {
    id: string;
    title: string;
    duration: number;
    itinerary?: ItineraryDay[];
  };
  onItineraryUpdated: () => void;
}

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function ItineraryManagementModal({ 
  isOpen, 
  onClose, 
  tour, 
  onItineraryUpdated 
}: ItineraryManagementModalProps) {
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Initialize itinerary days from tour data
  useEffect(() => {
    if (tour && tour.itinerary) {
      setItineraryDays([...tour.itinerary].sort((a, b) => a.dayNumber - b.dayNumber));
    } else {
      setItineraryDays([]);
    }
  }, [tour]);

  const handleAddNewDay = () => {
    console.log('🔧 handleAddNewDay called');
    console.log('📊 Current itineraryDays:', itineraryDays);
    
    const nextDayNumber = Math.max(0, ...itineraryDays.map(d => d.dayNumber)) + 1;
    console.log('📈 Next day number:', nextDayNumber);
    
    const newDay: ItineraryDay = {
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber}`,
      description: `Activities and experiences for day ${nextDayNumber} of the tour.`,
      activities: [''],
      meals: [],
      accommodation: null
    };
    
    console.log('✨ New day created:', newDay);
    
    setEditingDay(newDay);
    setIsAddingNew(true);
    
    console.log('✅ State updated - editingDay set, isAddingNew set to true');
  };

  const handleEditDay = (day: ItineraryDay) => {
    setEditingDay({ ...day });
    setIsAddingNew(false);
  };

  const handleSaveDay = async () => {
    console.log('💾 handleSaveDay called');
    console.log('📝 editingDay:', editingDay);
    console.log('🆕 isAddingNew:', isAddingNew);
    console.log('🏨 tour:', tour);
    
    if (!editingDay) {
      console.log('❌ No editingDay found, returning early');
      return;
    }

    console.log('🚀 Starting save process...');
    setIsLoading(true);
    setError(null);

    try {
      // Filter out empty activities
      const cleanedActivities = editingDay.activities.filter(activity => activity.trim() !== '');
      console.log('🧹 Cleaned activities:', cleanedActivities);
      
      const dayData = {
        ...editingDay,
        activities: cleanedActivities
      };
      console.log('📊 Day data to save:', dayData);

      if (isAddingNew) {
        console.log('➕ Creating new itinerary day...');
        
        const mutationInput = {
          input: {
            tourId: tour.id,
            dayNumber: dayData.dayNumber,
            title: dayData.title,
            description: dayData.description,
            activities: dayData.activities,
            meals: dayData.meals,
            accommodation: dayData.accommodation || null
          }
        };
        console.log('🔧 CREATE_TOUR_ITINERARY_MUTATION input:', mutationInput);
        
        // Create new itinerary day
        const result = await graphqlClient.request(CREATE_TOUR_ITINERARY_MUTATION, mutationInput);
        console.log('✅ Create result:', result);

        setItineraryDays(prev => [...prev, result.createTourItinerary].sort((a, b) => a.dayNumber - b.dayNumber));
      } else {
        console.log('✏️ Updating existing itinerary day...');
        
        const mutationInput = {
          id: dayData.id,
          input: {
            dayNumber: dayData.dayNumber,
            title: dayData.title,
            description: dayData.description,
            activities: dayData.activities,
            meals: dayData.meals,
            accommodation: dayData.accommodation || null
          }
        };
        console.log('🔧 UPDATE_TOUR_ITINERARY_MUTATION input:', mutationInput);
        
        // Update existing itinerary day
        const result = await graphqlClient.request(UPDATE_TOUR_ITINERARY_MUTATION, mutationInput);
        console.log('✅ Update result:', result);

        setItineraryDays(prev => 
          prev.map(day => day.id === dayData.id ? result.updateTourItinerary : day)
            .sort((a, b) => a.dayNumber - b.dayNumber)
        );
      }

      console.log('🎉 Save successful, cleaning up...');
      setEditingDay(null);
      setIsAddingNew(false);
    } catch (err: any) {
      console.error('❌ Save error:', err);
      setError(err.message || 'Failed to save itinerary day');
    } finally {
      console.log('🏁 Save process completed');
      setIsLoading(false);
    }
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!confirm('Are you sure you want to delete this itinerary day?')) return;

    setIsLoading(true);
    setError(null);

    try {
      await graphqlClient.request(DELETE_TOUR_ITINERARY_MUTATION, { id: dayId });
      setItineraryDays(prev => prev.filter(day => day.id !== dayId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete itinerary day');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityChange = (index: number, value: string) => {
    if (!editingDay) return;
    const newActivities = [...editingDay.activities];
    newActivities[index] = value;
    setEditingDay({ ...editingDay, activities: newActivities });
  };

  const handleAddActivity = () => {
    if (!editingDay) return;
    setEditingDay({ 
      ...editingDay, 
      activities: [...editingDay.activities, ''] 
    });
  };

  const handleRemoveActivity = (index: number) => {
    if (!editingDay) return;
    const newActivities = editingDay.activities.filter((_, i) => i !== index);
    setEditingDay({ ...editingDay, activities: newActivities });
  };

  const handleMealToggle = (meal: string) => {
    if (!editingDay) return;
    const newMeals = editingDay.meals.includes(meal)
      ? editingDay.meals.filter(m => m !== meal)
      : [...editingDay.meals, meal];
    setEditingDay({ ...editingDay, meals: newMeals });
  };

  if (!isOpen) return null;

  if (!tour) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Error</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-neutral-600">No tour selected. Please select a tour first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Manage Itinerary</h2>
            <p className="text-sm text-neutral-600 mt-1">{tour.title} • {tour.duration} days</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-88px)]">
          {/* Left Panel - Itinerary List */}
          <div className="w-1/2 border-r border-neutral-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-900">Itinerary Days</h3>
              <button
                onClick={handleAddNewDay}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Day</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {itineraryDays.map((day) => (
                <div
                  key={day.id || `new-${day.dayNumber}`}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    editingDay?.id === day.id || (isAddingNew && editingDay?.dayNumber === day.dayNumber)
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => handleEditDay(day)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {day.dayNumber}
                        </div>
                        <h4 className="font-medium text-neutral-900">{day.title}</h4>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-2">{day.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span className="text-xs text-neutral-500">{day.activities.length} activities</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Utensils className="w-3 h-3 text-neutral-400" />
                          <span className="text-xs text-neutral-500">{day.meals.length} meals</span>
                        </div>
                      </div>
                    </div>
                    {day.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDay(day.id!);
                        }}
                        disabled={isLoading}
                        className="p-1 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {itineraryDays.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No itinerary days created yet</p>
                  <p className="text-sm text-neutral-500">Click "Add Day" to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Edit Form */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {editingDay ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900">
                    {isAddingNew ? 'Add New Day' : 'Edit Day'}
                  </h3>
                  <button
                    onClick={handleSaveDay}
                    disabled={isLoading || !editingDay.title.trim() || !editingDay.description.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Day'}</span>
                  </button>
                </div>

                {/* Day Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingDay.dayNumber}
                    onChange={(e) => setEditingDay({ ...editingDay, dayNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Day Title
                  </label>
                  <input
                    type="text"
                    value={editingDay.title}
                    onChange={(e) => setEditingDay({ ...editingDay, title: e.target.value })}
                    placeholder="e.g., Accra City Tour"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingDay.description}
                    onChange={(e) => setEditingDay({ ...editingDay, description: e.target.value })}
                    placeholder="Describe what happens on this day..."
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Activities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Activities
                    </label>
                    <button
                      onClick={handleAddActivity}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Add Activity
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingDay.activities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => handleActivityChange(index, e.target.value)}
                          placeholder="Enter activity..."
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {editingDay.activities.length > 1 && (
                          <button
                            onClick={() => handleRemoveActivity(index)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Meals Included
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MEAL_OPTIONS.map((meal) => (
                      <label key={meal} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingDay.meals.includes(meal)}
                          onChange={() => handleMealToggle(meal)}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">{meal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accommodation */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={editingDay.accommodation || ''}
                    onChange={(e) => setEditingDay({ ...editingDay, accommodation: e.target.value || null })}
                    placeholder="e.g., 4-star hotel, eco-lodge, camping..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Edit className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">Select a day to edit</p>
                  <p className="text-sm text-neutral-500">or add a new day to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
