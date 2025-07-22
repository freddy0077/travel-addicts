'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { SingleImageUpload } from '@/components/ui/MediaUpload';
import { 
  Plus, Search, Filter, Grid3X3, List, Eye, Edit, Trash2, Upload, Star,
  MapPin, Calendar, User, Tag, Camera, X, Save, AlertCircle, Heart,
  Sparkles, ImageIcon, Globe, Clock, TrendingUp, Award, Zap
} from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  location?: string;
  category: string;
  tags: string[];
  photographer?: string;
  featured: boolean;
  published: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

const GALLERY_IMAGES_QUERY = `
  query GetGalleryImages($filters: GalleryImageFilters, $limit: Int, $offset: Int) {
    galleryImages(filters: $filters, limit: $limit, offset: $offset) {
      id title description imageUrl thumbnailUrl altText location category tags
      photographer featured published sortOrder createdAt updatedAt
      uploadedBy { id name email }
    }
  }
`;

const CREATE_GALLERY_IMAGE_MUTATION = `
  mutation CreateGalleryImage($input: CreateGalleryImageInput!) {
    createGalleryImage(input: $input) {
      id title description imageUrl thumbnailUrl altText location category tags
      photographer featured published sortOrder createdAt updatedAt
      uploadedBy { id name email }
    }
  }
`;

const UPDATE_GALLERY_IMAGE_MUTATION = `
  mutation UpdateGalleryImage($id: ID!, $input: UpdateGalleryImageInput!) {
    updateGalleryImage(id: $id, input: $input) {
      id title description imageUrl thumbnailUrl altText location category tags
      photographer featured published sortOrder createdAt updatedAt
      uploadedBy { id name email }
    }
  }
`;

const DELETE_GALLERY_IMAGE_MUTATION = `
  mutation DeleteGalleryImage($id: ID!) {
    deleteGalleryImage(id: $id)
  }
`;

const categories = [
  { value: 'ALL', label: 'All Categories', icon: Globe, color: 'from-blue-500 to-purple-500' },
  { value: 'DESTINATIONS', label: 'Destinations', icon: MapPin, color: 'from-green-500 to-teal-500' },
  { value: 'TOURS', label: 'Tours', icon: Camera, color: 'from-orange-500 to-red-500' },
  { value: 'CULTURE', label: 'Culture', icon: Award, color: 'from-purple-500 to-pink-500' },
  { value: 'WILDLIFE', label: 'Wildlife', icon: Sparkles, color: 'from-emerald-500 to-green-500' },
  { value: 'LANDSCAPES', label: 'Landscapes', icon: ImageIcon, color: 'from-blue-500 to-cyan-500' },
  { value: 'ACTIVITIES', label: 'Activities', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { value: 'FOOD', label: 'Food', icon: Heart, color: 'from-red-500 to-pink-500' },
  { value: 'PEOPLE', label: 'People', icon: User, color: 'from-indigo-500 to-blue-500' }
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);

  const [formData, setFormData] = useState({
    title: '', description: '', imageUrl: '', thumbnailUrl: '', altText: '',
    location: '', category: 'ALL', tags: [] as string[], photographer: '',
    featured: false, published: true, sortOrder: 0
  });

  useEffect(() => {
    loadGalleryImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm, selectedCategory]);

  const loadGalleryImages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      if (token) graphqlClient.setAuthToken(token);
      
      const result = await graphqlClient.request(GALLERY_IMAGES_QUERY, { limit: 100, offset: 0 });
      console.log('Gallery images loaded:', result.galleryImages);
      console.log('Sample image URLs:', result.galleryImages?.slice(0, 3).map(img => ({ title: img.title, url: img.imageUrl })));
      setImages(result.galleryImages || []);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...images];
    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.photographer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }
    setFilteredImages(filtered);
  };

  const handleCreateImage = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) graphqlClient.setAuthToken(token);
      
      const result = await graphqlClient.request(CREATE_GALLERY_IMAGE_MUTATION, { input: formData });
      setImages([result.createGalleryImage, ...images]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating gallery image:', error);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage) return;
    try {
      const token = localStorage.getItem('adminToken');
      if (token) graphqlClient.setAuthToken(token);
      
      const result = await graphqlClient.request(UPDATE_GALLERY_IMAGE_MUTATION, {
        id: selectedImage.id, input: formData
      });
      setImages(images.map(img => img.id === selectedImage.id ? result.updateGalleryImage : img));
      setShowEditModal(false);
      setSelectedImage(null);
      resetForm();
    } catch (error) {
      console.error('Error updating gallery image:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      const token = localStorage.getItem('adminToken');
      if (token) graphqlClient.setAuthToken(token);
      
      await graphqlClient.request(DELETE_GALLERY_IMAGE_MUTATION, { id: imageToDelete.id });
      setImages(images.filter(img => img.id !== imageToDelete.id));
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Error deleting gallery image:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', imageUrl: '', thumbnailUrl: '', altText: '',
      location: '', category: 'ALL', tags: [], photographer: '',
      featured: false, published: true, sortOrder: 0
    });
  };

  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setFormData({
      title: image.title, description: image.description || '', imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl || '', altText: image.altText, location: image.location || '',
      category: image.category, tags: image.tags, photographer: image.photographer || '',
      featured: image.featured, published: image.published, sortOrder: image.sortOrder || 0
    });
    setShowEditModal(true);
  };

  const stats = {
    total: images.length,
    published: images.filter(img => img.published).length,
    featured: images.filter(img => img.featured).length,
    categories: [...new Set(images.map(img => img.category))].length
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        {/* Header Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          }}></div>
          
          <div className="relative px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Title and Stats */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="mb-6 lg:mb-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 mb-4"
                  >
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Gallery Management
                      </h1>
                      <p className="text-gray-600 mt-1">Manage your travel gallery images and showcase</p>
                    </div>
                  </motion.div>
                </div>

                {/* Stats Cards */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {[
                    { label: 'Total Images', value: stats.total, icon: ImageIcon, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Published', value: stats.published, icon: Globe, color: 'from-green-500 to-emerald-500' },
                    { label: 'Featured', value: stats.featured, icon: Star, color: 'from-yellow-500 to-orange-500' },
                    { label: 'Categories', value: stats.categories, icon: Tag, color: 'from-purple-500 to-pink-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Controls Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 placeholder-gray-500"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-white/80 border border-gray-200/50 rounded-2xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100/80 rounded-2xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-white shadow-md text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-white shadow-md text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Add New Button */}
                    <motion.button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Image</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Gallery Grid */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl mt-8">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                    <p className="text-gray-500">Add some images to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((image) => (
                      <motion.div
                        key={image.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100"
                      >
                        <div className="aspect-square relative bg-gray-100 min-h-[200px]">
                          {image.imageUrl ? (
                            <Image 
                              src={image.imageUrl} 
                              alt={image.altText || image.title} 
                              fill 
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              onError={(e) => {
                                console.error('Image failed to load:', image.imageUrl);
                                // Hide the broken image and show placeholder
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                // Show the fallback placeholder
                                const parent = target.parentElement;
                                if (parent) {
                                  const placeholder = parent.querySelector('.image-placeholder');
                                  if (placeholder) {
                                    (placeholder as HTMLElement).style.opacity = '1';
                                  }
                                }
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback placeholder for broken images or no image */}
                          <div className={`image-placeholder absolute inset-0 flex items-center justify-center bg-gray-100 transition-opacity duration-200 ${image.imageUrl ? 'opacity-0' : 'opacity-100'}`}>
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(image)}
                              className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200"
                              title="Edit image"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setImageToDelete(image); setShowDeleteConfirm(true); }}
                              className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors duration-200"
                              title="Delete image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1">
                            {image.featured && (
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                            {!image.published && (
                              <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">Draft</span>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{image.title}</h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{image.description || 'No description'}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{image.location || 'No location'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Tag className="w-3 h-3" />
                            <span className="line-clamp-1">
                              {image.tags && image.tags.length > 0 ? image.tags.join(', ') : 'No tags'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showCreateModal ? 'Add New Image' : 'Edit Image'}
                  </h2>
                  <button
                    onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload *</label>
                    <SingleImageUpload
                      currentImage={formData.imageUrl}
                      onImageSelect={(url) => setFormData({ ...formData, imageUrl: url })}
                      folder="gallery"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text" value={formData.title} required
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Image title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text *</label>
                      <input
                        type="text" value={formData.altText} required
                        onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Descriptive alt text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description} rows={3}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Image description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category} required
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text" value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Location name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text" value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="nature, wildlife, safari"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox" checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox" checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Published</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={showCreateModal ? handleCreateImage : handleUpdateImage}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-4 h-4" />
                      {showCreateModal ? 'Create Image' : 'Update Image'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && imageToDelete && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Image</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{imageToDelete.title}"?
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleDeleteImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
