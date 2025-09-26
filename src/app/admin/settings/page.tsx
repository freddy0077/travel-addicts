'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Globe, 
  Mail, 
  CreditCard, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
    currency: string;
    language: string;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  payment: {
    paystackPublicKey: string;
    paystackSecretKey: string;
    testMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    bookingConfirmations: boolean;
    paymentAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireStrongPasswords: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  // Default settings structure
  const defaultSettings: SettingsData = {
    general: {
      siteName: 'Travel Addicts',
      siteDescription: 'Discover amazing destinations and book unforgettable tours',
      contactEmail: 'bookings@traveladdicts.org',
      contactPhone: '+233 59 387 8403',
      address: 'Accra, Ghana',
      timezone: 'Africa/Accra',
      currency: 'GHS',
      language: 'en'
    },
    email: {
      smtpHost: '',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@traveladdicts.org',
      fromName: 'Travel Addicts'
    },
    payment: {
      paystackPublicKey: '',
      paystackSecretKey: '',
      testMode: true
    },
    notifications: {
      emailNotifications: true,
      bookingConfirmations: true,
      paymentAlerts: true,
      systemAlerts: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireStrongPasswords: true
    }
  };

  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    // { id: 'email', name: 'Email', icon: Mail },
    // { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('travelAddicts_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with default settings to ensure all properties exist
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          general: { ...defaultSettings.general, ...parsedSettings.general },
          email: { ...defaultSettings.email, ...parsedSettings.email },
          payment: { ...defaultSettings.payment, ...parsedSettings.payment },
          notifications: { ...defaultSettings.notifications, ...parsedSettings.notifications },
          security: { ...defaultSettings.security, ...parsedSettings.security }
        };
        setSettings(mergedSettings);
      }
      
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error loading settings:', error);
      // If there's an error, use default settings
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save settings to localStorage
      localStorage.setItem('travelAddicts_settings', JSON.stringify(settings));
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSuccessMessage('Error saving settings. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    };
    setSettings(newSettings);
    
    // Auto-save to localStorage on every change (optional - you can remove this if you prefer manual save only)
    try {
      localStorage.setItem('travelAddicts_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error auto-saving settings:', error);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Site Description
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          >
            <option value="Africa/Accra">Africa/Accra (GMT)</option>
            <option value="Europe/London">Europe/London (GMT+1)</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => updateSetting('general', 'currency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          >
            <option value="GHS">Ghana Cedi (GHS)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            SMTP Host
          </label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            SMTP Port
          </label>
          <input
            type="text"
            value={settings.email.smtpPort}
            onChange={(e) => updateSetting('email', 'smtpPort', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            SMTP Password
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={settings.email.smtpPassword}
              onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            From Email
          </label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            From Name
          </label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          Configure your Paystack payment gateway settings. Keep your secret key secure and never share it publicly.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Paystack Public Key
        </label>
        <input
          type="text"
          value={settings.payment.paystackPublicKey}
          onChange={(e) => updateSetting('payment', 'paystackPublicKey', e.target.value)}
          placeholder="pk_test_..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Paystack Secret Key
        </label>
        <div className="relative">
          <input
            type={showPasswords ? "text" : "password"}
            value={settings.payment.paystackSecretKey}
            onChange={(e) => updateSetting('payment', 'paystackSecretKey', e.target.value)}
            placeholder="sk_test_..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-900">Test Mode</h4>
          <p className="text-sm text-gray-600">Enable test mode for development and testing</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.testMode}
            onChange={(e) => updateSetting('payment', 'testMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email notifications for important events' },
        { key: 'bookingConfirmations', label: 'Booking Confirmations', desc: 'Send confirmation emails for new bookings' },
        { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified when payments are received' },
        { key: 'systemAlerts', label: 'System Alerts', desc: 'Receive notifications about system issues' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-semibold text-gray-900">{item.label}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications[item.key as keyof typeof settings.notifications]}
              onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">Add an extra layer of security to admin accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="20"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-900">Require Strong Passwords</h4>
          <p className="text-sm text-gray-600">Enforce uppercase, lowercase, numbers, and special characters</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.requireStrongPasswords}
            onChange={(e) => updateSetting('security', 'requireStrongPasswords', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your Travel Addict platform</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Settings Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'email' && renderEmailSettings()}
            {activeTab === 'payment' && renderPaymentSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
