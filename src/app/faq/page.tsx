'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqCategories = [
  'All',
  'Booking & Payments',
  'Travel Planning',
  'During Your Trip',
  'Cancellations & Changes',
  'Travel Documents',
  'Health & Safety'
];

const faqs = [
  {
    id: 1,
    category: 'Booking & Payments',
    question: 'How do I book a tour with Travel Addicts?',
    answer: 'Booking with us is simple! You can browse our tours online, select your preferred dates and group size, then complete the booking process. We accept all major credit cards and offer flexible payment plans. You can also call our travel experts for personalized assistance.'
  },
  {
    id: 2,
    category: 'Booking & Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For bookings over $5,000, we offer flexible payment plans with a 25% deposit and the balance due 60 days before departure.'
  },
  {
    id: 3,
    category: 'Booking & Payments',
    question: 'Is my payment secure?',
    answer: 'Absolutely! We use industry-standard SSL encryption and work with trusted payment processors to ensure your financial information is completely secure. We are also IATA accredited and financially protected.'
  },
  {
    id: 4,
    category: 'Travel Planning',
    question: 'How far in advance should I book my trip?',
    answer: 'We recommend booking 3-6 months in advance for the best selection and pricing. However, we can often accommodate last-minute bookings depending on availability. Popular destinations during peak seasons should be booked even earlier.'
  },
  {
    id: 5,
    category: 'Travel Planning',
    question: 'Can you customize tours to my preferences?',
    answer: 'Yes! We specialize in creating personalized travel experiences. Our travel experts can modify existing itineraries or create completely custom tours based on your interests, budget, and travel style. Contact us to discuss your dream trip.'
  },
  {
    id: 6,
    category: 'Travel Planning',
    question: 'Do you offer group discounts?',
    answer: 'Yes, we offer attractive group discounts for parties of 8 or more travelers. The discount varies by destination and season, but typically ranges from 5-15% off the regular price. Contact our group travel specialists for a custom quote.'
  },
  {
    id: 7,
    category: 'During Your Trip',
    question: 'What support do you provide during my trip?',
    answer: 'We provide 24/7 emergency support throughout your journey. You\'ll have access to our local representatives, emergency contact numbers, and our travel app with real-time updates and assistance. We\'re always just a phone call away.'
  },
  {
    id: 8,
    category: 'During Your Trip',
    question: 'What if I encounter problems during my trip?',
    answer: 'Our 24/7 support team is equipped to handle any issues that may arise. Whether it\'s flight delays, accommodation problems, or medical emergencies, we have protocols in place and local contacts to resolve issues quickly and efficiently.'
  },
  {
    id: 9,
    category: 'Cancellations & Changes',
    question: 'What is your cancellation policy?',
    answer: 'Our cancellation policy varies by tour and timing. Generally, cancellations more than 90 days before departure incur a 10% fee, 60-90 days is 25%, 30-60 days is 50%, and less than 30 days is 100%. We strongly recommend travel insurance to protect your investment.'
  },
  {
    id: 10,
    category: 'Cancellations & Changes',
    question: 'Can I change my travel dates after booking?',
    answer: 'Yes, changes are possible subject to availability and may incur fees. Changes made more than 60 days before departure typically have lower fees. We\'ll work with you to find the best solution and minimize any additional costs.'
  },
  {
    id: 11,
    category: 'Travel Documents',
    question: 'What documents do I need for international travel?',
    answer: 'You\'ll need a valid passport with at least 6 months remaining validity. Some destinations require visas, which we can help you obtain. We provide detailed documentation requirements for each destination when you book.'
  },
  {
    id: 12,
    category: 'Travel Documents',
    question: 'Do you help with visa applications?',
    answer: 'Yes! We provide visa assistance for most destinations. Our team can guide you through the application process, help with required documents, and in some cases, submit applications on your behalf. Visa fees are additional to tour costs.'
  },
  {
    id: 13,
    category: 'Health & Safety',
    question: 'What health precautions should I take?',
    answer: 'Health requirements vary by destination. We provide comprehensive health and safety information for each tour, including recommended vaccinations, health precautions, and travel advisories. We recommend consulting your doctor 4-6 weeks before travel.'
  },
  {
    id: 14,
    category: 'Health & Safety',
    question: 'Is travel insurance required?',
    answer: 'While not mandatory, we strongly recommend comprehensive travel insurance. It protects you against trip cancellations, medical emergencies, lost luggage, and other unforeseen circumstances. We can recommend trusted insurance providers.'
  },
  {
    id: 15,
    category: 'Travel Planning',
    question: 'What\'s included in the tour price?',
    answer: 'Our tour prices typically include accommodation, most meals, transportation, guided tours, and entrance fees to attractions. Specific inclusions vary by tour and are clearly listed in each itinerary. International flights are usually additional unless specified.'
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Find answers to common questions about booking, travel planning, and our services
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                      openItems.includes(faq.id) && "transform rotate-180"
                    )}
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Still Have Questions Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our travel experts are here to help you plan the perfect journey.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <MessageCircle className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-blue-100 text-sm mb-4">
                Chat with our support team in real-time
              </p>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Chat
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-blue-100 text-sm mb-4">
                Speak directly with a travel expert
              </p>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                +1 (555) 123-4567
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-blue-100 text-sm mb-4">
                Send us a detailed message
              </p>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Contact Form
              </button>
            </div>
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Quick Travel Tips
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Book Early',
                tip: 'Book 3-6 months in advance for the best selection and pricing, especially for popular destinations during peak season.'
              },
              {
                title: 'Travel Insurance',
                tip: 'Always consider comprehensive travel insurance to protect your investment and provide peace of mind.'
              },
              {
                title: 'Documentation',
                tip: 'Ensure your passport is valid for at least 6 months beyond your travel dates and check visa requirements.'
              },
              {
                title: 'Health Precautions',
                tip: 'Consult your doctor 4-6 weeks before travel for recommended vaccinations and health advice.'
              },
              {
                title: 'Pack Smart',
                tip: 'Check weather conditions and cultural dress codes for your destination when packing.'
              },
              {
                title: 'Stay Connected',
                tip: 'Download our travel app for real-time updates, local recommendations, and 24/7 support access.'
              }
            ].map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <h3 className="font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
