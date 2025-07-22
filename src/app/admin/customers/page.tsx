'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomerModal from '@/components/admin/CustomerModal';
import { graphqlClient } from '@/lib/graphql-client';
import { Search, Users, Mail, Phone, MapPin, Calendar, Eye, Edit, UserPlus } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  emergencyContact: string | null;
  dietaryRequirements: string | null;
  medicalConditions: string | null;
  createdAt: string;
  updatedAt: string;
}

// Note: This query would need to be added to the backend schema
const CUSTOMERS_QUERY = `
  query Customers {
    customers {
      id
      email
      firstName
      lastName
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

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState<string>('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerModalMode, setCustomerModalMode] = useState<'add' | 'edit' | 'view'>('add');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadCustomers();
  }, [router]);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, nationalityFilter]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // For now, we'll use mock data since the customers query might not be implemented yet
      // In a real implementation, you would uncomment the line below:
      // const result = await graphqlClient.request(CUSTOMERS_QUERY, {}, {
      //   'Authorization': `Bearer ${token}`
      // });
      
      // Mock data for demonstration
      const mockCustomers: Customer[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+233 24 123 4567',
          dateOfBirth: '1985-06-15',
          nationality: 'Ghanaian',
          passportNumber: 'G1234567',
          emergencyContact: 'Jane Doe - +233 24 765 4321',
          dietaryRequirements: 'Vegetarian',
          medicalConditions: null,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          email: 'sarah.wilson@example.com',
          firstName: 'Sarah',
          lastName: 'Wilson',
          phone: '+233 20 987 6543',
          dateOfBirth: '1990-03-22',
          nationality: 'British',
          passportNumber: 'UK9876543',
          emergencyContact: 'Mike Wilson - +44 20 1234 5678',
          dietaryRequirements: null,
          medicalConditions: 'Diabetes',
          createdAt: '2024-02-10T14:20:00Z',
          updatedAt: '2024-02-10T14:20:00Z'
        },
        {
          id: '3',
          email: 'kwame.asante@example.com',
          firstName: 'Kwame',
          lastName: 'Asante',
          phone: '+233 26 555 1234',
          dateOfBirth: '1978-11-08',
          nationality: 'Ghanaian',
          passportNumber: 'G7654321',
          emergencyContact: 'Ama Asante - +233 26 555 5678',
          dietaryRequirements: 'Halal',
          medicalConditions: null,
          createdAt: '2024-03-05T09:15:00Z',
          updatedAt: '2024-03-05T09:15:00Z'
        }
      ];
      
      setCustomers(mockCustomers);
      // setCustomers(result.customers || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      // For demo purposes, still set mock data on error
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    if (nationalityFilter) {
      filtered = filtered.filter(customer => 
        customer.nationality?.toLowerCase().includes(nationalityFilter.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Get unique nationalities for filter
  const nationalities = Array.from(new Set(customers.map(c => c.nationality).filter(Boolean)));

  // Stats calculations
  const totalCustomers = customers.length;
  const recentCustomers = customers.filter(c => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(c.createdAt) > oneMonthAgo;
  }).length;
  const customersWithSpecialNeeds = customers.filter(c => 
    c.dietaryRequirements || c.medicalConditions
  ).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600">Manage customer profiles and information</p>
          </div>
          <button
            onClick={() => {
              setCustomerModalMode('add');
              setShowCustomerModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{recentCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nationalities</p>
                <p className="text-2xl font-bold text-gray-900">{nationalities.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Special Needs</p>
                <p className="text-2xl font-bold text-gray-900">{customersWithSpecialNeeds}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={nationalityFilter}
              onChange={(e) => setNationalityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Nationalities</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.nationality && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {customer.nationality}
                          </div>
                        )}
                        {customer.dateOfBirth && (
                          <div className="text-sm text-gray-500 mt-1">
                            Age: {calculateAge(customer.dateOfBirth)}
                          </div>
                        )}
                        {customer.passportNumber && (
                          <div className="text-sm text-gray-500 mt-1">
                            Passport: {customer.passportNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.dietaryRequirements && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
                            Diet: {customer.dietaryRequirements}
                          </div>
                        )}
                        {customer.medicalConditions && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Medical: {customer.medicalConditions}
                          </div>
                        )}
                        {!customer.dietaryRequirements && !customer.medicalConditions && (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomerId(customer.id);
                            setCustomerModalMode('view');
                            setShowCustomerModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomerId(customer.id);
                            setCustomerModalMode('edit');
                            setShowCustomerModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || nationalityFilter ? 'Try adjusting your search or filters.' : 'No customers have registered yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
      {showCustomerModal && (
        <CustomerModal
          isOpen={showCustomerModal}
          mode={customerModalMode}
          customerId={selectedCustomerId}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomerId(null);
          }}
          onSuccess={loadCustomers}
        />
      )}
    </AdminLayout>
  );
}
