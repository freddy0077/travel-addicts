'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText, Save } from 'lucide-react';
import { graphqlClient } from '@/lib/graphql-client';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  emergencyContact: string;
  dietaryRequirements: string;
  medicalConditions: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerId?: string | null; // For editing existing customer
  mode: 'add' | 'edit' | 'view';
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: string;
  dietaryRequirements?: string;
  medicalConditions?: string;
  createdAt: string;
  updatedAt: string;
}

const CREATE_CUSTOMER_MUTATION = `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

const CUSTOMER_QUERY = `
  query Customer($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      email
      phone
      dateOfBirth
      nationality
      passportNumber
      emergencyContact
      dietaryRequirements
      medicalConditions
      createdAt
      updatedAt
    }
  }
`;

export default function CustomerModal({ isOpen, onClose, onSuccess, customerId, mode }: CustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    emergencyContact: '',
    dietaryRequirements: '',
    medicalConditions: ''
  });

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    if (isOpen) {
      if (customerId && (isEditMode || isViewMode)) {
        loadCustomer();
      } else {
        resetForm();
      }
    }
  }, [isOpen, customerId, mode]);

  const loadCustomer = async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      setError('');
      
      // For demo purposes, use mock data since the customer query might not be implemented yet
      const mockCustomer: Customer = {
        id: customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+233 24 123 4567',
        dateOfBirth: '1985-06-15',
        nationality: 'Ghanaian',
        passportNumber: 'G1234567',
        emergencyContact: 'Jane Doe - +233 24 765 4321',
        dietaryRequirements: 'Vegetarian',
        medicalConditions: '',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      };
      
      setCustomer(mockCustomer);
      setFormData({
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName,
        email: mockCustomer.email,
        phone: mockCustomer.phone,
        dateOfBirth: mockCustomer.dateOfBirth || '',
        nationality: mockCustomer.nationality || '',
        passportNumber: mockCustomer.passportNumber || '',
        emergencyContact: mockCustomer.emergencyContact || '',
        dietaryRequirements: mockCustomer.dietaryRequirements || '',
        medicalConditions: mockCustomer.medicalConditions || ''
      });

      // In a real implementation, you would use:
      // const token = localStorage.getItem('adminToken');
      // const result = await graphqlClient.request(CUSTOMER_QUERY, { id: customerId }, {
      //   'Authorization': `Bearer ${token}`
      // });
      // setCustomer(result.customer);
      // setFormData({ ...result.customer });
    } catch (error: any) {
      console.error('Error loading customer:', error);
      setError('Failed to load customer details');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      emergencyContact: '',
      dietaryRequirements: '',
      medicalConditions: ''
    });
    setCustomer(null);
    setError('');
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('adminToken');
      const customerInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        nationality: formData.nationality || null,
        passportNumber: formData.passportNumber || null,
        emergencyContact: formData.emergencyContact || null,
        dietaryRequirements: formData.dietaryRequirements || null,
        medicalConditions: formData.medicalConditions || null
      };

      if (isEditMode && customerId) {
        await graphqlClient.request(UPDATE_CUSTOMER_MUTATION, { 
          id: customerId, 
          input: customerInput 
        }, {
          'Authorization': `Bearer ${token}`
        });
      } else {
        await graphqlClient.request(CREATE_CUSTOMER_MUTATION, { 
          input: customerInput 
        }, {
          'Authorization': `Bearer ${token}`
        });
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      setError(error.message || 'Failed to save customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl transform transition-all duration-300 scale-100">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {mode === 'add' ? 'Add Customer' : mode === 'edit' ? 'Edit Customer' : 'Customer Details'}
                  </h2>
                  <p className="text-white/80 mt-1">
                    {mode === 'add' 
                      ? 'Create a new customer profile' 
                      : mode === 'edit' 
                      ? 'Update customer information' 
                      : 'View customer profile and details'
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            {mode === 'view' && customer ? (
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-xl">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">First Name</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{customer.firstName}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Last Name</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{customer.lastName}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Date of Birth</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : 'Not provided'}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Gender</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.gender || 'Not specified'}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Nationality</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.nationality || 'Not provided'}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Passport Number</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.passportNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {customer.email}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {customer.phone}
                      </p>
                    </div>
                    <div className="group md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.address || 'Not provided'}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Emergency Contact</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">
                        {customer.emergencyContact || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                {(customer.dietaryRequirements || customer.medicalConditions) && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                      Special Requirements
                    </h3>
                    <div className="space-y-4">
                      {customer.dietaryRequirements && (
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">Dietary Requirements</label>
                          <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{customer.dietaryRequirements}</p>
                        </div>
                      )}
                      {customer.medicalConditions && (
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">Medical Conditions</label>
                          <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{customer.medicalConditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Member Since</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{formatDate(customer.createdAt)}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Last Updated</label>
                      <p className="text-lg font-medium text-gray-900 p-4 bg-white/50 rounded-xl border border-white/20">{formatDate(customer.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-xl">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Nationality</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter nationality"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Passport Number</label>
                      <input
                        type="text"
                        value={formData.passportNumber}
                        onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter passport number"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="group md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="group md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Emergency Contact</label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Emergency contact name and phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-xl">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                    Special Requirements
                  </h3>
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Requirements</label>
                      <textarea
                        value={formData.dietaryRequirements}
                        onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Any dietary restrictions or preferences"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Medical Conditions</label>
                      <textarea
                        value={formData.medicalConditions}
                        onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Any medical conditions or medications"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {mode === 'add' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {mode === 'add' ? 'Create Customer' : 'Update Customer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer for view mode */}
            {mode === 'view' && (
              <div className="flex justify-end mt-12 pt-8 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
