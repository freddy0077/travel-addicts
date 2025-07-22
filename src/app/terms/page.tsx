'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Please read these terms carefully before using our services
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="prose prose-lg max-w-none">
            {/* Last Updated */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <p className="text-sm text-blue-700 mb-0">
                <strong>Last Updated:</strong> January 1, 2025
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Travel Addicts ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website, mobile application, and travel services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Travel Addicts is a licensed tour operator registered in Ghana, operating under the Ghana Tourism Authority and a member of the Ghana Association of Tour Operators (GATO).
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definitions</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li><strong>"Service"</strong> refers to our website, mobile application, and travel booking services.</li>
                <li><strong>"User"</strong> refers to any individual who accesses or uses our Service.</li>
                <li><strong>"Booking"</strong> refers to any reservation made through our platform.</li>
                <li><strong>"Tour Package"</strong> refers to any travel itinerary offered by Travel Addicts.</li>
                <li><strong>"Third-Party Providers"</strong> refers to hotels, airlines, transport companies, and other service providers.</li>
              </ul>
            </section>

            {/* Booking and Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Booking and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Booking Process</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All bookings are subject to availability and confirmation. A booking is only confirmed when you receive a confirmation email from us and payment has been processed successfully.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Payment Terms</h3>
              <ul className="text-gray-600 leading-relaxed space-y-2 mb-4">
                <li>• All prices are quoted in Ghanaian Cedis (GH₵) unless otherwise stated</li>
                <li>• Payment is required at the time of booking unless otherwise agreed</li>
                <li>• We accept payments via Paystack, including mobile money, bank transfers, and cards</li>
                <li>• Group bookings may require a deposit with balance due before departure</li>
                <li>• All payments are processed securely through our payment partners</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">3.3 Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                Prices may vary based on seasonality, availability, and group size. All prices include applicable taxes unless otherwise stated. We reserve the right to adjust prices due to currency fluctuations, fuel surcharges, or changes in government taxes.
              </p>
            </section>

            {/* Cancellation and Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cancellation and Refunds</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our cancellation policy varies by tour package and booking date. Please refer to our detailed{' '}
                <Link href="/cancellation" className="text-blue-600 hover:text-blue-800 underline">
                  Cancellation Policy
                </Link>{' '}
                for specific terms and refund schedules.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 General Cancellation Terms</h3>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li>• Cancellations must be made in writing via email or through our platform</li>
                <li>• Refund amounts depend on the time between cancellation and departure date</li>
                <li>• Some bookings may be non-refundable or subject to supplier cancellation fees</li>
                <li>• We strongly recommend purchasing travel insurance to protect against unforeseen circumstances</li>
              </ul>
            </section>

            {/* Travel Requirements */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Travel Requirements</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Documentation</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are responsible for ensuring you have all required travel documents, including valid passports, visas, and health certificates. We are not liable for any issues arising from inadequate documentation.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Health and Safety</h3>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li>• You must disclose any medical conditions that may affect your travel</li>
                <li>• Follow all health and safety guidelines provided by our tour guides</li>
                <li>• Comply with local laws and customs at all destinations</li>
                <li>• Travel insurance is strongly recommended for all bookings</li>
              </ul>
            </section>

            {/* Liability and Insurance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Liability and Insurance</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.1 Our Liability</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Travel Addicts acts as an intermediary between you and third-party service providers. Our liability is limited to the services we directly provide. We are not liable for acts, errors, omissions, or negligence of third-party providers.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.2 Force Majeure</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, strikes, or pandemics.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">6.3 Insurance</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain professional indemnity and public liability insurance as required by Ghana Tourism Authority. However, we strongly recommend that all travelers purchase comprehensive travel insurance.
              </p>
            </section>

            {/* User Conduct */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. User Conduct</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By using our services, you agree to:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li>• Provide accurate and complete information when making bookings</li>
                <li>• Respect other travelers, tour guides, and local communities</li>
                <li>• Follow all tour guidelines and safety instructions</li>
                <li>• Not engage in any illegal or disruptive behavior</li>
                <li>• Respect local customs, traditions, and environmental guidelines</li>
                <li>• Not use our services for any unauthorized commercial purposes</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All content on our website and mobile application, including text, images, logos, and software, is owned by Travel Addicts or our licensors and is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works from our content without our express written permission.
              </p>
            </section>

            {/* Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.1 Complaints Procedure</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any complaints about our services, please contact us immediately. We will investigate all complaints promptly and work to resolve issues fairly.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">10.2 Governing Law</h3>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of Ghana. Any disputes arising from these Terms or your use of our services will be subject to the exclusive jurisdiction of the courts of Ghana.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Travel Addicts</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Address:</strong> 123 Liberation Road, Accra, Ghana</p>
                  <p><strong>Phone:</strong> +233 30 123 4567</p>
                  <p><strong>Email:</strong> legal@traveladdicts.com</p>
                  <p><strong>Website:</strong> www.traveladdicts.com</p>
                  <p><strong>Business Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM GMT</p>
                  <p><strong>Ghana Tourism Authority License:</strong> GTA/LIC/2024/001</p>
                  <p><strong>GATO Membership:</strong> GATO/MEM/2024/089</p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Acknowledgment</h3>
                <p className="text-blue-700 leading-relaxed">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you have any questions about these Terms, please contact us before using our services.
                </p>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cancellation"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Cancellation Policy
            </Link>
            <Link
              href="/contact"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
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
