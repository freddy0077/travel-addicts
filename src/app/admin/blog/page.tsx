'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Tag,
  Grid,
  List,
  MoreVertical,
  Globe,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Archive,
  Loader2,
  Clock,
  Users,
  Camera,
  TrendingUp,
  BookOpen,
  PenTool,
  Star,
  Filter,
  FileText,
  Hash
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AddBlogPostModal from '@/components/admin/AddBlogPostModal';
import { graphqlClient } from '@/lib/graphql-client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    email: string;
  };
  publishedAt: string | null;
  category: {
    name: string;
  };
  tags: string[];
  image: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

const BLOG_POSTS_QUERY = `
  query BlogPosts($status: PostStatus) {
    blogPosts(status: $status) {
      id
      title
      slug
      excerpt
      author {
        name
        email
      }
      publishedAt
      category {
        name
      }
      tags
      image
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

const DELETE_BLOG_POST_MUTATION = `
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id) {
      success
      message
    }
  }
`;

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Set auth token in GraphQL client
    graphqlClient.setAuthToken(token);
    
    // Load blog posts from backend
    loadBlogPosts();
  }, [router]);

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true);
      const result = await graphqlClient.request(BLOG_POSTS_QUERY);
      setBlogPosts(result.blogPosts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      await graphqlClient.request(DELETE_BLOG_POST_MUTATION, { id: postId });
      
      // Remove from local state
      setBlogPosts(prev => prev.filter(p => p.id !== postId));
      
      console.log('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category.name === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT': return <AlertCircle className="w-4 h-4" />;
      case 'ARCHIVED': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200'
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  // Map blog posts to our African hero images for travel-related content
  const getBlogHeroImage = (title: string, fallbackImage: string) => {
    const imageMap: { [key: string]: string } = {
      'africa': '/images/destinations/serengeti-migration.jpg',
      'safari': '/images/destinations/masai-mara-balloon.jpg',
      'travel': '/images/destinations/kilimanjaro-sunrise.jpg',
      'adventure': '/images/destinations/victoria-falls.jpg',
      'beach': '/images/destinations/zanzibar-beach.jpg',
      'culture': '/images/destinations/cape-town-table-mountain.jpg',
      'wildlife': '/images/destinations/kruger-national-park.jpg',
      'desert': '/images/destinations/sossusvlei-dunes.jpg',
      'guide': '/images/destinations/sahara-desert-morocco.jpg',
      'tips': '/images/destinations/pyramids-giza-egypt.jpg'
    };

    const lowerTitle = title.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (lowerTitle.includes(key)) {
        return image;
      }
    }

    // If no match found, return fallback or a random African image
    if (fallbackImage && !fallbackImage.includes('placeholder')) {
      return fallbackImage;
    }
    
    // Return a random African destination image as fallback
    const randomImages = Object.values(imageMap);
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = {
    total: blogPosts.length,
    published: blogPosts.filter(p => p.status === 'PUBLISHED').length,
    draft: blogPosts.filter(p => p.status === 'DRAFT').length,
    featured: blogPosts.filter(p => p.featured).length
  };

  const categories = [...new Set(blogPosts.map(p => p.category.name))];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Blog Management
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Create and manage inspiring travel stories and guides
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAddPostModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-primary-700 hover:to-primary-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Post
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Modern Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.published}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.draft}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <PenTool className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.featured}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modern Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, authors, content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setCategoryFilter('all');
                          setSearchTerm('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Blog Posts Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredPosts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by creating your first blog post.'}
                </p>
                <button
                  onClick={() => setIsAddPostModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Post
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredPosts.map((post, index) => {
                  const heroImage = getBlogHeroImage(post.title, post.image);
                  
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Post Image */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                        {heroImage ? (
                          <img
                            src={heroImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {post.featured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)}`}>
                          {getStatusIcon(post.status)}
                          <span className="ml-1 capitalize">{post.status.toLowerCase()}</span>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <User className="w-4 h-4 mr-1" />
                              <span>{post.author.name}</span>
                            </div>
                          </div>
                          
                          {/* Actions Dropdown */}
                          <div className="relative group/menu">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                              <div className="py-2">
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                  <Eye className="w-4 h-4 mr-3" />
                                  View Post
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                  <Edit className="w-4 h-4 mr-3" />
                                  Edit Post
                                </button>
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  disabled={deleteLoading === post.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                >
                                  {deleteLoading === post.id ? (
                                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 mr-3" />
                                  )}
                                  Delete Post
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Post Meta */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(post.category.name)}`}>
                            <Hash className="w-3 h-3 mr-1" />
                            <span>{post.category.name}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                            View
                          </button>
                          <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {isAddPostModalOpen && (
        <AddBlogPostModal
          isOpen={isAddPostModalOpen}
          onClose={() => setIsAddPostModalOpen(false)}
          onPostAdded={loadBlogPosts}
        />
      )}
    </AdminLayout>
  );
}
