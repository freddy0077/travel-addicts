'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { X, Send, User, Mail, MapPin, Calendar, Users, DollarSign, MessageSquare, Sparkles } from 'lucide-react';
import { graphqlClient, SUBMIT_CUSTOM_BOOKING_MUTATION } from '@/lib/graphql-client';


interface CustomBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomBookingModal({ isOpen, onClose }: CustomBookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDates: '',
    travelers: '',
    budget: '',
    message: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted. handleSubmit function called.');

    if (!formData.name || !formData.email || !formData.destination || !formData.travelDates || !formData.travelers || !formData.budget) {
      console.error('Validation failed. All required fields must be filled.');
      return;
    }

    console.log('Form data before submission:', formData);

    try {
      setLoading(true);
      console.log('Attempting to call submitCustomBooking mutation...');
      
      const result = await graphqlClient.request<{ submitCustomBooking: { success: boolean; message: string } }>(
        SUBMIT_CUSTOM_BOOKING_MUTATION,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          travelDates: formData.travelDates,
          travelers: parseInt(String(formData.travelers), 10),
          budget: parseInt(String(formData.budget), 10),
          message: formData.message,
        }
      );
      
      console.log('Mutation call successful:', result);
      setSubmissionStatus('success');
    } catch (err) {
      console.error('Error calling submitCustomBooking mutation:', err);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <Dialog.Title as="h3" className="text-2xl font-bold">
                                        Plan a Custom Trip
                                    </Dialog.Title>
                                    <p className="text-primary-100 mt-1">Tell us your dream, we'll make it happen.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                onClick={onClose}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                      {submissionStatus === 'success' ? (
                        <div className="text-center py-12">
                          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <Send className="w-16 h-16 mx-auto text-primary-500" />
                            <h3 className="mt-4 text-2xl font-bold text-gray-900">Request Sent!</h3>
                            <p className="mt-2 text-gray-600">Our travel experts will get back to you shortly.</p>
                          </motion.div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField icon={User} name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required />
                            <InputField icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
                          </div>
                          <InputField icon={MapPin} name="phone" type="tel" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleInputChange} />
                          <InputField icon={MapPin} name="destination" placeholder="Dream Destination (e.g., Bali, Indonesia)" value={formData.destination} onChange={handleInputChange} required />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField icon={Calendar} name="travelDates" placeholder="Preferred Travel Dates (e.g., Mid-June)" value={formData.travelDates} onChange={handleInputChange} required />
                            <InputField icon={Users} name="travelers" type="number" placeholder="Number of Travelers" value={formData.travelers} onChange={handleInputChange} required />
                          </div>
                          <InputField icon={DollarSign} name="budget" type="text" placeholder="Estimated Budget per Person ($)" value={formData.budget} onChange={handleInputChange} required />
                          <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                              <MessageSquare className="w-4 h-4 mr-2 text-primary-500" />
                              <span>Your Message</span>
                            </label>
                            <textarea
                              name="message"
                              rows={4}
                              placeholder="Tell us more about your ideal trip..."
                              value={formData.message}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                          <div className="pt-4">
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-5 h-5" />
                              <span>{loading ? 'Sending...' : 'Send Request'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </AnimatePresence>
  );
}

// Helper component for input fields
const InputField = ({ icon: Icon, ...props }) => (
  <div>
    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 mr-2 text-primary-500" />
      <span>{props.placeholder}</span>
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
    />
  </div>
);