'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
  Plane
} from 'lucide-react';
import { BRAND } from '@/lib/brand';

const stats = [
  { icon: Globe, label: 'Countries Covered', value: BRAND.stats.destinations },
  { icon: Users, label: 'Happy Travelers', value: BRAND.stats.happyTravelers },
  { icon: Award, label: 'Awards Won', value: BRAND.stats.awards },
  { icon: Star, label: 'Average Rating', value: BRAND.stats.averageRating },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We believe travel transforms lives and creates lasting memories that enrich the human experience.'
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Your safety and peace of mind are our top priorities. We partner only with trusted local operators.'
  },
  {
    icon: Compass,
    title: 'Expert Guidance',
    description: 'Our travel experts have firsthand knowledge of every destination we offer, ensuring authentic experiences.'
  },
  {
    icon: Globe,
    title: 'Sustainable Tourism',
    description: 'We are committed to responsible travel that benefits local communities and preserves natural beauty.'
  },
];

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    image: '/api/placeholder/300/300',
    bio: 'With 15+ years in luxury travel, Sarah founded Travel Addicts to share her passion for extraordinary journeys.',
  },
  {
    name: 'David Chen',
    role: 'Head of Operations',
    image: '/api/placeholder/300/300',
    bio: 'David ensures every trip runs smoothly, bringing 12 years of operational excellence to our team.',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Travel Experience Designer',
    image: '/api/placeholder/300/300',
    bio: 'Maria crafts unique itineraries that blend luxury with authentic local experiences across Europe and Asia.',
  },
  {
    name: 'James Wilson',
    role: 'Adventure Specialist',
    image: '/api/placeholder/300/300',
    bio: 'James specializes in adventure and safari experiences, having led expeditions across Africa and South America.',
  },
];

const milestones = [
  { year: '2018', event: 'Travel Addicts founded with a vision to redefine luxury travel' },
  { year: '2019', event: 'Launched our first curated tours to Switzerland and Italy' },
  { year: '2020', event: 'Adapted to provide safe, flexible travel options during challenging times' },
  { year: '2021', event: 'Expanded to cover 50+ destinations across 6 continents' },
  { year: '2022', event: 'Won "Best Luxury Tour Operator" award from Travel Excellence Awards' },
  { year: '2023', event: 'Reached 25,000+ happy travelers milestone' },
  { year: '2024', event: 'Launched sustainable travel initiatives and carbon-neutral tours' },
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
                We're passionate travelers who believe that extraordinary journeys create extraordinary memories. 
                Since 2018, we've been crafting luxury travel experiences that go beyond the ordinary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Our Story
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Meet the Team
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/api/placeholder/600/400"
                  alt="Travel team exploring beautiful destination"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-large">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Plane className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{BRAND.stats.destinations}</div>
                    <div className="text-sm text-gray-600">Destinations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  {BRAND.about}
                </p>
                <p>
                  Founded in {BRAND.foundedYear}, Travel Addicts has grown from a small team of passionate 
                  travel enthusiasts to a recognized leader in creating exceptional travel experiences. 
                  Our commitment to excellence, attention to detail, and genuine care for our clients 
                  has earned us the trust of thousands of travelers worldwide.
                </p>
                <p>
                  Every journey we craft is designed to inspire, educate, and create lasting memories. 
                  From cultural immersion tours to exotic getaways, we believe that travel has the power 
                  to transform lives and broaden perspectives.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-large">
                <Image
                  src="/api/placeholder/600/400"
                  alt="Beautiful travel destination"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-large">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Since 2018</div>
                    <div className="text-sm text-gray-600">Creating memories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {BRAND.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mr-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {BRAND.vision}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from planning your itinerary to 
              supporting you throughout your journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team of travel experts brings decades of combined experience 
              to ensure your journey exceeds expectations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-primary-600 font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to a leading luxury travel company, here are the key 
              milestones in our journey.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-200 to-secondary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-soft">
                      <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-medium"></div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us create an unforgettable travel experience tailored just for you. 
            Get in touch with our travel experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Plan My Trip
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Contact Us
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
