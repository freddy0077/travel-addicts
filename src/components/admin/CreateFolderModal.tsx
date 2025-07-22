'use client';

import { useState } from 'react';
import { X, FolderPlus, Save } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
}

export default function CreateFolderModal({ 
  isOpen, 
  onClose, 
  onCreateFolder 
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    if (folderName.length < 2) {
      setError('Folder name must be at least 2 characters');
      return;
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(folderName)) {
      setError('Folder name can only contain letters, numbers, spaces, hyphens, and underscores');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onCreateFolder(folderName.trim());
      handleClose();
    } catch (error) {
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setError('');
    setIsCreating(false);
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
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 scale-100">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FolderPlus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create New Folder</h2>
                  <p className="text-white/80 text-sm mt-1">
                    Organize your media files
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter folder name"
                  required
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  Use letters, numbers, spaces, hyphens, and underscores only
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isCreating}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !folderName.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Folder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
