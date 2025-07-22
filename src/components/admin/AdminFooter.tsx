'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Shield, Clock, Users, HelpCircle } from 'lucide-react';

export default function AdminFooter() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* System Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">All systems operational</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Last updated: {mounted ? currentTime : '--:--:--'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  href="/admin/bookings" 
                  className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  View Recent Bookings
                </Link>
                <Link 
                  href="/admin/customers" 
                  className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Customer Management
                </Link>
                <Link 
                  href="/admin/settings" 
                  className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  System Settings
                </Link>
              </div>
            </div>

            {/* Support & Documentation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Help Documentation
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Contact Support
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Security Guidelines
                </a>
              </div>
            </div>

            {/* Admin Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Admin Panel</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Version 2.1.0
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-3 h-3 mr-1" />
                  <span>Admin Dashboard</span>
                </div>
                <Link 
                  href="/" 
                  className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Public Site
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                {currentYear} Travel Addicts Admin Panel. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-gray-500">
                  Logged in as: <span className="font-medium text-gray-700">Admin User</span>
                </span>
                <div className="flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
