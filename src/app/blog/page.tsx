'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react';
import { cn, formatDate, slugify, truncateText } from '@/lib/utils';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in the Swiss Alps You Must Visit",
    excerpt: "Discover breathtaking locations off the beaten path in Switzerland's most stunning mountain range.",
    content: "The Swiss Alps offer more than just famous peaks...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Destinations",
    tags: ["Switzerland", "Alps", "Hidden Gems", "Mountains"],
    image: "/api/placeholder/800/500",
    featured: true,
  },
  {
    id: 2,
    title: "A Culinary Journey Through Tuscany",
    excerpt: "Experience authentic Italian cuisine in the heart of Tuscany's rolling hills and vineyards.",
    content: "Tuscany's culinary landscape is as diverse as its stunning countryside...",
    author: "Marco Rossi",
    publishedAt: "2024-01-12",
    readTime: "6 min read",
    category: "Food & Culture",
    tags: ["Italy", "Tuscany", "Food", "Wine"],
    image: "/api/placeholder/800/500",
    featured: false,
  },
  {
    id: 3,
    title: "Solo Travel Safety: Essential Tips for Women",
    excerpt: "Comprehensive guide to staying safe while exploring the world on your own.",
    content: "Solo travel can be incredibly rewarding, especially for women...",
    author: "Emma Thompson",
    publishedAt: "2024-01-10",
    readTime: "12 min read",
    category: "Travel Tips",
    tags: ["Solo Travel", "Safety", "Women", "Tips"],
    image: "/api/placeholder/800/500",
    featured: false,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Japanese Cherry Blossom Season",
    excerpt: "Plan your perfect sakura viewing trip with our comprehensive guide to Japan's cherry blossom season.",
    content: "Cherry blossom season in Japan is a magical time...",
    author: "Yuki Tanaka",
    publishedAt: "2024-01-08",
    readTime: "10 min read",
    category: "Destinations",
    tags: ["Japan", "Cherry Blossom", "Sakura", "Spring"],
    image: "/api/placeholder/800/500",
    featured: true,
  },
  {
    id: 5,
    title: "Sustainable Travel: How to Reduce Your Carbon Footprint",
    excerpt: "Learn practical ways to travel more sustainably and protect the destinations you love.",
    content: "Sustainable travel is becoming increasingly important...",
    author: "David Green",
    publishedAt: "2024-01-05",
    readTime: "7 min read",
    category: "Sustainable Travel",
    tags: ["Sustainability", "Eco-friendly", "Environment", "Tips"],
    image: "/api/placeholder/800/500",
    featured: false,
  },
  {
    id: 6,
    title: "Luxury Safari: Best Lodges in Kenya and Tanzania",
    excerpt: "Experience the ultimate African safari in these world-class luxury lodges.",
    content: "A luxury safari in East Africa offers unparalleled wildlife experiences...",
    author: "James Wilson",
    publishedAt: "2024-01-03",
    readTime: "9 min read",
    category: "Luxury Travel",
    tags: ["Safari", "Kenya", "Tanzania", "Luxury", "Wildlife"],
    image: "/api/placeholder/800/500",
    featured: false,
  },
];

const categories = ["All", "Destinations", "Food & Culture", "Travel Tips", "Sustainable Travel", "Luxury Travel"];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
            Travel Stories & Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Discover inspiring destinations, travel tips, and cultural insights from our expert writers
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          <div className={cn(
            "mt-6 transition-all duration-300",
            showFilters || "hidden lg:block"
          )}>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
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
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
                >
                  <Link href={`/blog/${slugify(post.title)}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                        <div className="flex gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <Link href={`/blog/${slugify(post.title)}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
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

        {/* Newsletter Signup */}
        <section className="mt-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Never Miss a Story
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest travel insights, tips, and destination guides delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
