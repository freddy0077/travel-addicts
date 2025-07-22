'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Trash2, Eye, EyeOff, Tag, FileText, Settings } from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';

interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  image: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle: string;
  seoDescription: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface AddBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CREATE_BLOG_POST_MUTATION = `
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      slug
      status
    }
  }
`;

// Use predefined categories since backend doesn't have separate blogCategories query
const PREDEFINED_CATEGORIES = [
  { id: 'travel-tips', name: 'Travel Tips', slug: 'travel-tips' },
  { id: 'destinations', name: 'Destinations', slug: 'destinations' },
  { id: 'culture', name: 'Culture', slug: 'culture' },
  { id: 'adventure', name: 'Adventure', slug: 'adventure' },
  { id: 'food', name: 'Food & Cuisine', slug: 'food' },
  { id: 'photography', name: 'Photography', slug: 'photography' },
  { id: 'budget-travel', name: 'Budget Travel', slug: 'budget-travel' },
  { id: 'luxury-travel', name: 'Luxury Travel', slug: 'luxury-travel' }
];

export default function AddBlogPostModal({ isOpen, onClose, onSuccess }: AddBlogPostModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [''],
    image: '',
    featured: false,
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: ''
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Content', icon: Tag },
    { number: 3, title: 'SEO & Review', icon: Settings }
  ];

  const handleInputChange = (field: keyof BlogPostFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.categoryId) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('adminToken');
      
      const blogPostInput = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: formData.categoryId,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        image: formData.image,
        featured: formData.featured,
        status: formData.status,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt
      };

      await graphqlClient.request(CREATE_BLOG_POST_MUTATION, { input: blogPostInput }, {
        'Authorization': `Bearer ${token}`
      });

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        categoryId: '',
        tags: [''],
        image: '',
        featured: false,
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: ''
      });
      setCurrentStep(1);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      setError(error.message || 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      tags: [''],
      image: '',
      featured: false,
      status: 'DRAFT',
      seoTitle: '',
      seoDescription: ''
    });
    setCurrentStep(1);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-5xl transform transition-all duration-300 scale-100">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Create New Blog Post</h2>
                  <p className="text-white/80 mt-1">Share engaging content with your audience</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-white text-primary-600 shadow-lg' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-white' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <span className="text-white/80 text-sm">
                Step {currentStep} of {steps.length}: {steps.find(s => s.number === currentStep)?.title}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary-500" />
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg placeholder-gray-400"
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary-500" />
                        Category *
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select a category</option>
                        {PREDEFINED_CATEGORIES.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Excerpt *
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400 resize-none"
                        placeholder="Brief description of the blog post"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-xl">
                          <Eye className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Featured Post</h4>
                          <p className="text-sm text-gray-600">Highlight this post on homepage</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as 'DRAFT' | 'PUBLISHED')}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary-500" />
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={16}
                    className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400 resize-none"
                    placeholder="Write your blog post content here..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    You can use Markdown formatting for rich text.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-primary-500" />
                    Tags
                  </label>
                  <div className="space-y-3">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter tag"
                        />
                        {formData.tags.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTag}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: SEO & Review */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - SEO */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-primary-500" />
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="SEO optimized title (defaults to post title)"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {formData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        SEO Description
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400 resize-none"
                        placeholder="SEO meta description (defaults to excerpt)"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {formData.seoDescription.length}/160 characters
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Review */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-primary-600" />
                        Review Your Blog Post
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Title:</span> 
                          <span className="text-gray-900">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Category:</span> 
                          <span className="text-gray-900">{PREDEFINED_CATEGORIES.find(c => c.id === formData.categoryId)?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Status:</span> 
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            formData.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {formData.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Featured:</span> 
                          <span className="text-gray-900">{formData.featured ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Tags:</span> 
                          <span className="text-gray-900">{formData.tags.filter(t => t.trim()).join(', ') || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create Blog Post'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
