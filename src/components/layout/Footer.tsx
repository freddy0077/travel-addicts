import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const footerLinks = {
  destinations: [
    { name: 'Europe', href: '/destinations?continent=Europe' },
    { name: 'Asia', href: '/destinations?continent=Asia' },
    { name: 'Africa', href: '/destinations?continent=Africa' },
    { name: 'Americas', href: '/destinations?continent=Americas' },
    { name: 'Oceania', href: '/destinations?continent=Oceania' },
  ],
  // company: [
  //   { name: 'About Us', href: '/about' },
  //   { name: 'Our Team', href: '/about#team' },
  //   { name: 'Careers', href: '/careers' },
  //   { name: 'Press', href: '/press' },
  //   { name: 'Awards', href: '/about#awards' },
  // ],
  support: [
    { name: 'Help Center', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Travel Insurance', href: '/insurance' },
    { name: 'Booking Terms', href: '/terms' },
    { name: 'Cancellation Policy', href: '/cancellation' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: BRAND.social.facebook, icon: Facebook },
  { name: 'Twitter', href: BRAND.social.twitter, icon: Twitter },
  { name: 'Instagram', href: BRAND.social.instagram, icon: Instagram },
  { name: 'LinkedIn', href: BRAND.social.linkedin, icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">TA</span>
              </div>
              <span className="text-2xl font-serif font-bold">{BRAND.name}</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {BRAND.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">{BRAND.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">{BRAND.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">{BRAND.address}</span>
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Destinations</h3>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/*/!* Company *!/*/}
          {/*<div>*/}
          {/*  <h3 className="text-lg font-semibold mb-6">Company</h3>*/}
          {/*  <ul className="space-y-3">*/}
          {/*    {footerLinks.company.map((link) => (*/}
          {/*      <li key={link.name}>*/}
          {/*        <Link*/}
          {/*          href={link.href}*/}
          {/*          className="text-gray-300 hover:text-primary-400 transition-colors"*/}
          {/*        >*/}
          {/*          {link.name}*/}
          {/*        </Link>*/}
          {/*      </li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for travel tips, exclusive deals, and destination inspiration.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
