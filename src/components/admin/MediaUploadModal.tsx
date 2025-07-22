'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Video, File, Trash2, FolderPlus } from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  folders: Array<{ id: string; name: string }>;
}

export default function MediaUploadModal({ 
  isOpen, 
  onClose, 
  onUploadComplete,
  folders 
}: MediaUploadModalProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = await createFilePreview(file);
      
      newFiles.push({
        id: generateId(),
        file,
        preview,
        progress: 0,
        status: 'pending'
      });
    }
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const simulateUpload = async (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate occasional upload errors
          if (Math.random() < 0.1) {
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
                : f
            ));
            reject(new Error('Upload failed'));
          } else {
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress: 100, status: 'completed' }
                : f
            ));
            resolve();
          }
        } else {
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress, status: 'uploading' }
              : f
          ));
        }
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Upload files sequentially
      for (const uploadFile of uploadFiles) {
        if (uploadFile.status === 'pending') {
          await simulateUpload(uploadFile);
        }
      }
      
      // Wait a moment then close modal and refresh
      setTimeout(() => {
        onUploadComplete();
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setUploadFiles([]);
    setSelectedFolder('');
    setNewFolderName('');
    setShowNewFolderInput(false);
    setIsUploading(false);
    onClose();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl transform transition-all duration-300 scale-100">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-t-3xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Upload Media</h2>
                  <p className="text-white/80 mt-1">
                    Add images, videos, and documents to your media library
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Folder Selection */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination Folder</h3>
              
              <div className="flex items-center gap-4">
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
                >
                  <option value="">Select a folder</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </button>
              </div>

              {showNewFolderInput && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {/* File Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 mb-4">
                Support for images, videos, and documents up to 50MB each
              </p>
              <button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Choose Files
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* File List */}
            {uploadFiles.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Files to Upload ({uploadFiles.length})
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {uploadFiles.map(uploadFile => (
                    <div key={uploadFile.id} className="bg-white/50 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-4">
                        {/* File Preview/Icon */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {uploadFile.preview ? (
                            <img 
                              src={uploadFile.preview} 
                              alt={uploadFile.file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getFileIcon(uploadFile.file)
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadFile.file.size)}
                          </p>
                          
                          {/* Progress Bar */}
                          {uploadFile.status === 'uploading' && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadFile.progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.round(uploadFile.progress)}% uploaded
                              </p>
                            </div>
                          )}
                          
                          {/* Status Messages */}
                          {uploadFile.status === 'completed' && (
                            <p className="text-sm text-green-600 mt-1">✓ Upload completed</p>
                          )}
                          
                          {uploadFile.status === 'error' && (
                            <p className="text-sm text-red-600 mt-1">
                              ✗ {uploadFile.error}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        {uploadFile.status !== 'uploading' && (
                          <button
                            onClick={() => removeFile(uploadFile.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0 || isUploading}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Files ({uploadFiles.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
