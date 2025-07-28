'use client';

import { Calendar, Clock, CreditCard, AlertTriangle, Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Understanding your rights and responsibilities when cancelling your Ghana travel experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700">
                This cancellation policy is governed by Ghana Tourism Authority regulations and 
                international travel standards. Please read carefully before making your booking.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-primary-600" />
            Cancellation Timeline & Fees
          </h2>
          
          <div className="space-y-6">
            {/* 60+ Days */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-700">60+ Days Before Departure</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Full Refund
                </span>
              </div>
              <ul className="space-y-2 text-neutral-600">
                <li>• 100% refund of tour cost</li>
                <li>• Administrative fee of $3 applies</li>
                <li>• Refund processed within 7-14 business days</li>
                <li>• Payment gateway fees (3.5%) non-refundable</li>
              </ul>
            </div>

            {/* 30-59 Days */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">30-59 Days Before Departure</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  75% Refund
                </span>
              </div>
              <ul className="space-y-2 text-neutral-600">
                <li>• 75% refund of tour cost</li>
                <li>• 25% cancellation fee applies</li>
                <li>• Administrative fee of $3 applies</li>
                <li>• Refund processed within 7-14 business days</li>
              </ul>
            </div>

            {/* 15-29 Days */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-amber-700">15-29 Days Before Departure</h3>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  50% Refund
                </span>
              </div>
              <ul className="space-y-2 text-neutral-600">
                <li>• 50% refund of tour cost</li>
                <li>• 50% cancellation fee applies</li>
                <li>• Administrative fee of $3 applies</li>
                <li>• Refund processed within 7-14 business days</li>
              </ul>
            </div>

            {/* 7-14 Days */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-orange-700">7-14 Days Before Departure</h3>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  25% Refund
                </span>
              </div>
              <ul className="space-y-2 text-neutral-600">
                <li>• 25% refund of tour cost</li>
                <li>• 75% cancellation fee applies</li>
                <li>• Administrative fee of $3 applies</li>
                <li>• Refund processed within 7-14 business days</li>
              </ul>
            </div>

            {/* Less than 7 Days */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-700">Less than 7 Days Before Departure</h3>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  No Refund
                </span>
              </div>
              <ul className="space-y-2 text-neutral-600">
                <li>• No refund available</li>
                <li>• 100% cancellation fee applies</li>
                <li>• Exceptional circumstances may be considered</li>
                <li>• Travel insurance claims may apply</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Special Circumstances */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-primary-600" />
            Special Circumstances
          </h2>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Medical Emergencies</h3>
                <p className="text-neutral-600">
                  Cancellations due to serious illness or medical emergencies (with medical certificate) 
                  may be eligible for full refund minus administrative fees, regardless of timing.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Government Travel Restrictions</h3>
                <p className="text-neutral-600">
                  If the Ghana Government or your home country issues travel restrictions that prevent 
                  your travel, full refund will be provided or tour can be rescheduled at no extra cost.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Natural Disasters</h3>
                <p className="text-neutral-600">
                  Tours cancelled due to natural disasters, severe weather conditions, or force majeure 
                  events will be fully refunded or rescheduled based on customer preference.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Visa Denial</h3>
                <p className="text-neutral-600">
                  If your visa application is denied (with official documentation), you may receive 
                  a full refund minus administrative fees and non-refundable third-party costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Operator Cancellations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-primary-600" />
            Tour Operator Cancellations
          </h2>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="space-y-4">
              <p className="text-neutral-600">
                Travel Addicts reserves the right to cancel tours under the following circumstances:
              </p>
              
              <ul className="space-y-2 text-neutral-600 ml-4">
                <li>• Insufficient bookings (minimum 4 participants required)</li>
                <li>• Safety concerns or security issues in destination areas</li>
                <li>• Natural disasters or extreme weather conditions</li>
                <li>• Government restrictions or regulatory changes</li>
                <li>• Force majeure events beyond our control</li>
              </ul>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-green-800 mb-2">Your Rights When We Cancel:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Full refund of all payments made</li>
                  <li>• Alternative tour dates at no extra cost</li>
                  <li>• Upgrade to premium tour at same price (subject to availability)</li>
                  <li>• Compensation for non-refundable expenses (up to $32)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-primary-600" />
            Refund Process
          </h2>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">How to Request a Refund</h3>
                <ol className="space-y-2 text-neutral-600 ml-4">
                  <li>1. Contact our customer service team via email or phone</li>
                  <li>2. Provide your booking reference number and reason for cancellation</li>
                  <li>3. Submit any required documentation (medical certificates, visa denials, etc.)</li>
                  <li>4. Receive confirmation of cancellation and refund amount</li>
                  <li>5. Refund processed to original payment method within 7-14 business days</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Refund Methods</h3>
                <ul className="space-y-2 text-neutral-600 ml-4">
                  <li>• Mobile Money (MTN, Vodafone, AirtelTigo) - 1-3 business days</li>
                  <li>• Bank Transfer - 3-7 business days</li>
                  <li>• Credit/Debit Card - 7-14 business days</li>
                  <li>• Paystack refunds - 5-10 business days</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Note:</strong> Refund processing times may vary depending on your bank or 
                  payment provider. International refunds may take longer due to currency conversion 
                  and international banking procedures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Insurance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-primary-600" />
            Travel Insurance Recommendation
          </h2>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="space-y-4">
              <p className="text-neutral-600">
                We strongly recommend purchasing comprehensive travel insurance to protect your investment 
                and provide additional coverage beyond our cancellation policy.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Recommended Coverage</h3>
                <ul className="space-y-2 text-neutral-600 ml-4">
                  <li>• Trip cancellation and interruption</li>
                  <li>• Medical emergencies and evacuation</li>
                  <li>• Lost or delayed baggage</li>
                  <li>• Flight delays and missed connections</li>
                  <li>• Personal liability coverage</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800">
                  <strong>Important:</strong> Travel insurance should be purchased within 14 days of 
                  your initial booking to ensure maximum coverage benefits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Contact Us for Cancellations</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customer Service</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">+233 24 123 4567</p>
                    <p className="text-sm text-neutral-600">Mon-Fri: 8AM-6PM GMT</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">cancellations@traveladdict.com</p>
                    <p className="text-sm text-neutral-600">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Office Location</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                <div>
                  <p className="font-medium">Travel Addicts Ghana</p>
                  <p className="text-neutral-600">
                    123 Liberation Road<br />
                    Ridge, Accra<br />
                    Ghana
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    Office Hours: Mon-Fri 8AM-5PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="mb-12">
          <div className="bg-neutral-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Legal Information</h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>
                This cancellation policy is governed by the laws of Ghana and is subject to the 
                jurisdiction of Ghanaian courts. It complies with Ghana Tourism Authority regulations 
                and international consumer protection standards.
              </p>
              <p>
                Travel Addicts is licensed by the Ghana Tourism Authority (License No. GTA/2024/001) 
                and is a member of the Ghana Association of Tour Operators (GATO).
              </p>
              <p>
                This policy was last updated on January 1, 2024, and may be subject to changes. 
                Customers will be notified of any policy changes affecting existing bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Reference</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-primary-800 mb-2">Cancellation Deadlines:</h4>
                <ul className="space-y-1 text-primary-700">
                  <li>• 60+ days: Full refund (minus fees)</li>
                  <li>• 30-59 days: 75% refund</li>
                  <li>• 15-29 days: 50% refund</li>
                  <li>• 7-14 days: 25% refund</li>
                  <li>• &lt;7 days: No refund</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary-800 mb-2">Standard Fees:</h4>
                <ul className="space-y-1 text-primary-700">
                  <li>• Administrative fee: $3</li>
                  <li>• Payment gateway fee: 3.5%</li>
                  <li>• Refund processing: 7-14 days</li>
                  <li>• Customer service: 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
