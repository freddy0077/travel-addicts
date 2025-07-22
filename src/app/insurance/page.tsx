'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Heart, Plane, MapPin, Clock, Phone, Mail, CheckCircle, AlertTriangle, Globe } from 'lucide-react';

export default function InsurancePage() {
  const insuranceTypes = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Comprehensive Travel Insurance",
      description: "Complete protection for your entire journey",
      features: [
        "Medical expenses up to GH₵500,000",
        "Trip cancellation & interruption",
        "Lost luggage compensation",
        "Emergency evacuation",
        "24/7 assistance hotline"
      ],
      price: "From GH₵150 per person",
      recommended: true
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Medical Travel Insurance",
      description: "Essential medical coverage for peace of mind",
      features: [
        "Medical expenses up to GH₵250,000",
        "Emergency dental treatment",
        "Prescription medication",
        "Hospital accommodation",
        "Medical repatriation"
      ],
      price: "From GH₵80 per person",
      recommended: false
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Trip Protection Insurance",
      description: "Protect your investment in your dream vacation",
      features: [
        "Trip cancellation coverage",
        "Flight delay compensation",
        "Missed connection coverage",
        "Travel document replacement",
        "Currency exchange protection"
      ],
      price: "From GH₵120 per person",
      recommended: false
    }
  ];

  const whyInsurance = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      title: "Medical Emergencies",
      description: "Healthcare costs abroad can be extremely expensive. Insurance covers medical treatment, hospitalization, and emergency evacuation."
    },
    {
      icon: <Plane className="w-6 h-6 text-blue-500" />,
      title: "Trip Cancellations",
      description: "Unexpected events can force you to cancel your trip. Insurance reimburses non-refundable expenses like flights and hotels."
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-500" />,
      title: "Lost or Stolen Items",
      description: "Luggage can be lost, delayed, or stolen. Insurance provides compensation for essential items and personal belongings."
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-500" />,
      title: "Travel Disruptions",
      description: "Weather, strikes, or other disruptions can affect your travel plans. Insurance covers additional expenses and rebooking costs."
    }
  ];

  const partners = [
    {
      name: "Allianz Travel",
      logo: "/api/placeholder/120/60",
      description: "Global leader in travel insurance with comprehensive coverage options"
    },
    {
      name: "Enterprise Insurance",
      logo: "/api/placeholder/120/60",
      description: "Leading Ghanaian insurance company with local expertise"
    },
    {
      name: "SIC Insurance",
      logo: "/api/placeholder/120/60",
      description: "Trusted insurance provider with excellent customer service"
    },
    {
      name: "Vanguard Assurance",
      logo: "/api/placeholder/120/60",
      description: "Reliable coverage with competitive rates for travelers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            Travel Insurance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Protect your journey with comprehensive travel insurance coverage
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Travel Insurance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Why Do You Need Travel Insurance?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Travel insurance is essential protection against unexpected events that could disrupt your trip or result in significant financial loss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyInsurance.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {item.icon}
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">{item.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Insurance Plans */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Choose Your Protection Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the insurance coverage that best fits your travel needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insuranceTypes.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.recommended ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-4">
                    <div className="text-primary-600">{plan.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-4">{plan.price}</p>
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    Get Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Insurance Partners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Our Insurance Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with trusted insurance providers to offer you the best coverage options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="mb-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-24 h-12 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How to Claim */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
                How to Make a Claim
              </h2>
              <p className="text-xl text-gray-600">
                Filing an insurance claim is straightforward. Follow these simple steps:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h3>
                <p className="text-gray-600">Call our 24/7 emergency hotline or email us as soon as possible after the incident.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Gather Documents</h3>
                <p className="text-gray-600">Collect all relevant documents including receipts, medical reports, and police reports if applicable.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Submit Claim</h3>
                <p className="text-gray-600">Complete the claim form and submit it along with all supporting documentation.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full font-bold text-lg mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Reimbursed</h3>
                <p className="text-gray-600">Once approved, you'll receive your reimbursement directly to your bank account or mobile money.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Important Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-8 text-center">
              Important Information
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Covered</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Medical emergencies and hospitalization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Trip cancellation due to illness or emergency
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Lost, stolen, or damaged luggage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Flight delays and missed connections
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Emergency evacuation and repatriation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Personal liability coverage
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Not Covered</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Pre-existing medical conditions (unless declared)
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Travel to high-risk or war zones
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Extreme sports without additional coverage
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Alcohol or drug-related incidents
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Intentional self-harm or reckless behavior
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    Business equipment or professional tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
                Need Help with Insurance?
              </h2>
              <p className="text-xl text-gray-600">
                Our insurance specialists are here to help you choose the right coverage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">24/7 Emergency Hotline</p>
                <p className="text-blue-600 font-semibold">+233 30 123 4567</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">Insurance Inquiries</p>
                <p className="text-green-600 font-semibold">insurance@traveladdicts.com</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Hours</h3>
                <p className="text-gray-600 mb-2">Monday - Friday</p>
                <p className="text-purple-600 font-semibold">8:00 AM - 6:00 PM GMT</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/terms"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/cancellation"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cancellation Policy
            </Link>
            <Link
              href="/contact"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
