'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  Heart, 
  BookOpen, 
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check
} from 'lucide-react';
import { cn, formatDate, slugify } from '@/lib/utils';

// Sample blog post data (in a real app, this would come from an API or CMS)
const getBlogPost = (slug: string) => {
  const posts = [
    {
      id: 1,
      title: "10 Hidden Gems in the Swiss Alps You Must Visit",
      excerpt: "Discover breathtaking locations off the beaten path in Switzerland's most stunning mountain range.",
      content: `
        <p>The Swiss Alps offer more than just famous peaks like the Matterhorn and Jungfrau. Beyond the well-trodden tourist paths lie hidden gems that showcase the raw beauty and authentic culture of this magnificent mountain range.</p>

        <h2>1. Lauterbrunnen Valley - The Valley of 72 Waterfalls</h2>
        <p>Often overshadowed by its famous neighbors, Lauterbrunnen Valley is a spectacular glacial valley with towering cliffs and cascading waterfalls. The Staubbach Falls, plunging 297 meters, inspired poets like Lord Byron and continues to mesmerize visitors today.</p>

        <h2>2. Appenzell - Switzerland's Most Traditional Village</h2>
        <p>Step back in time in Appenzell, where colorful wooden houses line cobblestone streets and traditional Swiss culture thrives. This charming village offers authentic experiences from cheese-making demonstrations to folk music performances.</p>

        <h2>3. Verzasca Valley - The Emerald Valley</h2>
        <p>Known for its crystal-clear emerald waters and ancient stone bridges, Verzasca Valley feels like a fairy tale come to life. The famous Ponte dei Salti bridge offers perfect photo opportunities and swimming spots in pristine mountain pools.</p>

        <h2>4. Gimmelwald - A Car-Free Mountain Paradise</h2>
        <p>Perched high above the Lauterbrunnen Valley, this tiny car-free village offers stunning views and authentic Alpine life. With only 130 residents, Gimmelwald provides an intimate glimpse into traditional Swiss mountain culture.</p>

        <h2>5. Blausee - The Blue Lake</h2>
        <p>This small but incredibly beautiful lake near Kandersteg is famous for its brilliant blue color and crystal-clear waters. Legend says the lake was formed by the tears of a heartbroken maiden, giving it its ethereal blue hue.</p>

        <h2>Planning Your Visit</h2>
        <p>The best time to visit these hidden gems is between June and September when mountain paths are accessible and weather conditions are favorable. Consider purchasing a Swiss Travel Pass for convenient transportation between locations.</p>

        <p>Remember to respect local customs and environment. These pristine locations remain beautiful because visitors treat them with care and consideration.</p>
      `,
      author: {
        name: "Sarah Johnson",
        bio: "Travel writer and photographer specializing in European destinations",
        avatar: "/api/placeholder/100/100"
      },
      publishedAt: "2024-01-15",
      readTime: "8 min read",
      category: "Destinations",
      tags: ["Switzerland", "Alps", "Hidden Gems", "Mountains"],
      image: "/api/placeholder/1200/600",
      featured: true,
    }
  ];

  return posts.find(post => slugify(post.title) === slug);
};

// Related posts
const relatedPosts = [
  {
    id: 2,
    title: "A Culinary Journey Through Tuscany",
    excerpt: "Experience authentic Italian cuisine in the heart of Tuscany's rolling hills.",
    image: "/api/placeholder/400/250",
    category: "Food & Culture",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Solo Travel Safety: Essential Tips for Women",
    excerpt: "Comprehensive guide to staying safe while exploring the world on your own.",
    image: "/api/placeholder/400/250",
    category: "Travel Tips",
    readTime: "12 min read",
  },
  {
    id: 4,
    title: "The Ultimate Guide to Japanese Cherry Blossom Season",
    excerpt: "Plan your perfect sakura viewing trip with our comprehensive guide.",
    image: "/api/placeholder/400/250",
    category: "Destinations",
    readTime: "10 min read",
  },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/blog"
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Category Badge */}
        <div className="absolute top-6 right-6">
          <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {post.readTime}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Article
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-2xl shadow-soft">
            <div className="flex items-center gap-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                <p className="text-gray-600 text-sm">{post.author.bio}</p>
              </div>
            </div>
            
            {/* Social Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-colors",
                  isLiked 
                    ? "bg-red-50 text-red-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                <span className="text-sm font-medium">
                  {isLiked ? "Liked" : "Like"}
                </span>
              </button>
              
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
                
                {/* Share Dropdown */}
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-large border p-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                    {isCopied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm"
            >
              <Tag className="w-4 h-4" />
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Related Posts */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-200 pt-12"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${slugify(relatedPost.title)}`}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                        {relatedPost.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {relatedPost.readTime}
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Enjoyed This Article?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for more travel insights and destination guides delivered to your inbox.
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
        </motion.section>
      </div>
    </div>
  );
}
