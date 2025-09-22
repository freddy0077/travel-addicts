'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  Globe,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: [BRAND.phone],
    description: 'Mon-Fri 8AM-6PM GMT'
  },
  {
    icon: Mail,
    title: 'Email',
    details: [BRAND.email],
    description: 'We respond within 24 hours'
  },
  {
    icon: MapPin,
    title: 'Office',
    details: [BRAND.address],
    description: 'Visit us by appointment'
  },
  {
    icon: Clock,
    title: 'Hours',
    details: ['Mon-Fri: 8AM-6PM', 'Sat: 9AM-3PM'],
    description: 'GMT timezone'
  },
];

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'booking', label: 'New Booking' },
  { value: 'existing', label: 'Existing Booking' },
  { value: 'custom', label: 'Custom Trip Planning' },
  { value: 'group', label: 'Group Travel' },
  { value: 'corporate', label: 'Corporate Travel' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.inquiryType) newErrors.inquiryType = 'Please select an inquiry type';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: '',
        subject: '',
        message: '',
        preferredContact: 'email',
        newsletter: false,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Ready to plan your next adventure? Our travel experts are here to help create your perfect journey.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 mb-1">{detail}</p>
                        ))}
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white"
              >
                <h3 className="font-bold mb-4">Need Immediate Help?</h3>
                <div className="space-y-3">
                  <button className="flex items-center gap-3 w-full text-left hover:bg-white/10 rounded-lg p-2 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    Live Chat Support
                  </button>
                  <button className="flex items-center gap-3 w-full text-left hover:bg-white/10 rounded-lg p-2 transition-colors">
                    <Calendar className="w-5 h-5" />
                    Schedule a Call
                  </button>
                  <button className="flex items-center gap-3 w-full text-left hover:bg-white/10 rounded-lg p-2 transition-colors">
                    <Globe className="w-5 h-5" />
                    Browse FAQ
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-large p-8"
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                            errors.firstName ? "border-red-300" : "border-gray-200"
                          )}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          errors.lastName ? "border-red-300" : "border-gray-200"
                        )}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                            errors.email ? "border-red-300" : "border-gray-200"
                          )}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="+233 244 000 0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                        errors.inquiryType ? "border-red-300" : "border-gray-200"
                      )}
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-1 text-sm text-red-600">{errors.inquiryType}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                        errors.subject ? "border-red-300" : "border-gray-200"
                      )}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none",
                        errors.message ? "border-red-300" : "border-gray-200"
                      )}
                      placeholder="Tell us about your travel plans, questions, or how we can assist you..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleInputChange}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleInputChange}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Phone</span>
                      </label>
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="mt-1 text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700">
                      I'd like to receive travel tips, destination guides, and special offers via email.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200",
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-medium hover:shadow-large"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Located in the heart of New York City, our office is open for consultations by appointment.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-large overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would be integrated here</p>
                <p className="text-sm text-gray-500 mt-2">
                    Kumsark Estates, Oyarifa, Accra-Ghana
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
