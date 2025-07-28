'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Award, 
  Heart, 
  MapPin, 
  Star, 
  Shield, 
  Compass,
  Camera,
  Plane,
  Music,
  Mic,
  Calendar
} from 'lucide-react';
import { BRAND } from '@/lib/brand';

const stats = [
  { icon: Calendar, label: 'Founded', value: '2016' },
  { icon: Globe, label: 'Countries Covered', value: BRAND.stats.destinations },
  { icon: Users, label: 'Happy Travelers', value: BRAND.stats.happyTravelers },
  { icon: Star, label: 'Average Rating', value: BRAND.stats.averageRating },
];

const values = [
  {
    icon: Music,
    title: 'Cultural Bridge',
    description: 'Connecting the world of tourism with the soul of African art through music and storytelling.'
  },
  {
    icon: Heart,
    title: 'Meaningful Experiences',
    description: 'We believe travel is about meaningful experiences, genuine connections, and unforgettable moments.'
  },
  {
    icon: Compass,
    title: 'Expert Curation',
    description: 'Over a decade of entertainment industry experience brings unique perspective to travel curation.'
  },
  {
    icon: Shield,
    title: 'Licensed & Trusted',
    description: 'Fully licensed and registered travel company in Ghana, collaborating with local and international organizations.'
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                About {BRAND.name}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Founded by Ghanaian musician and cultural ambassador Eric Listowell (Mula Gad), 
                Travel Addicts bridges the world of tourism and the soul of African art.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#story" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center">
                  Our Story
                </a>
                <a href="#vision-mission" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                  Vision & Mission
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-orange-400 to-red-600 h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <Music className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Music Meets Travel</h3>
                    <p className="text-orange-100">Where culture, music, and adventure unite</p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-large">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mula Gad</p>
                    <p className="text-sm text-gray-600">Founder</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-large">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Since 2016</p>
                    <p className="text-sm text-gray-600">Licensed & Trusted</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
            >
              Our Story
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              From global stages to curating unforgettable travel experiences
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="prose prose-lg text-gray-700">
                <p>
                  Founded by Ghanaian musician, songwriter, and performer <strong>Eric Listowell</strong> — 
                  popularly known as <strong>Mula Gad</strong> — Travel Addicts was born from a passion for 
                  hosting, storytelling, and sharing the vibrant culture of Ghana with the world.
                </p>
                
                <p>
                  As a cultural ambassador and tourism advocate with over a decade of experience in the 
                  entertainment industry, Mula Gad combined his love for music, culture, and hospitality 
                  to create unique travel experiences that bridge the world of tourism and the soul of African art.
                </p>
                
                <p>
                  His journey — from performing on global stages to curating unforgettable events for fans 
                  and guests — revealed the powerful connection between music, culture, and travel.
                </p>
                
                <p>
                  In <strong>2016</strong>, that vision gave birth to Travel Addicts — now a fully licensed 
                  and registered travel and tour company in Ghana. Since its inception, Travel Addicts has 
                  grown into a trusted and reliable brand, proudly collaborating with local and international 
                  organizations to deliver world-class travel experiences.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-600 h-full flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Music className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Eric Listowell</h3>
                    <p className="text-lg mb-2">Mula Gad</p>
                    <p className="text-primary-100">Founder & Cultural Ambassador</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
            >
              Our Philosophy
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12">
              <div className="prose prose-xl text-gray-700 mx-auto">
                <p className="text-2xl font-medium leading-relaxed">
                  At Travel Addicts, we believe travel is more than just visiting destinations — 
                  it's about <span className="text-primary-600 font-semibold">meaningful experiences</span>, 
                  <span className="text-secondary-600 font-semibold"> genuine connections</span>, and 
                  <span className="text-accent-600 font-semibold"> unforgettable moments</span>.
                </p>
                
                <p className="text-lg mt-6">
                  Our dedicated team is committed to offering seamless cultural tours, exotic getaways, 
                  group expeditions, and custom-designed adventures, all crafted with care, professionalism, 
                  and a true love for discovery.
                </p>
                
                <p className="text-lg mt-4">
                  Whether you're seeking an authentic local Ghanaian or international experience or a 
                  grand African adventure, Travel Addicts is your trusted partner in exploration.
                </p>
                
                <p className="text-xl font-semibold text-primary-600 mt-8">
                  Your journey begins with us. Welcome to the adventure.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-large hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision-mission" className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
            >
              Vision & Mission
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-large"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Travel Addicts, our mission is to connect people to unforgettable experiences by 
                providing exceptional travel and tourism services with passion, integrity, and 
                personalized care. We are committed to delivering seamless adventures that inspire, 
                educate, and create lasting memories — making every journey with us a truly remarkable one.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-large"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become a leading travel and tourism brand recognized for redefining the travel 
                experience — connecting people to the world through authentic adventures, exceptional 
                service, and a commitment to creating meaningful, lasting memories across destinations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let Travel Addicts craft your perfect journey. From cultural immersion to luxury getaways, 
              we're here to make your travel dreams come true.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/tours" 
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Tours
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
