'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  Eye,
  Plus,
  FolderPlus,
  Folder,
  MoreVertical,
  Calendar,
  FileText
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaUpload from '@/components/ui/MediaUpload';
import { useMediaUpload, MediaFile, formatFileSize } from '@/hooks/useMediaUpload';
import { graphqlClient, MEDIA_FILES_QUERY } from '@/lib/graphql-client';

interface MediaFolder {
  name: string;
  count: number;
  path: string;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  const { deleteFile } = useMediaUpload();

  // Mock folders based on uploaded files
  const folders: MediaFolder[] = [
    { name: 'All Files', count: mediaFiles.length, path: 'all' },
    { name: 'Destinations', count: mediaFiles.filter(f => f.folder.includes('destination')).length, path: 'destination' },
    { name: 'Tours', count: mediaFiles.filter(f => f.folder.includes('tour')).length, path: 'tour' },
    { name: 'Blog', count: mediaFiles.filter(f => f.folder.includes('blog')).length, path: 'blog' },
    { name: 'General', count: mediaFiles.filter(f => f.folder.includes('general')).length, path: 'general' },
  ];

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      // For now, we'll use the uploaded files from the component state
      // In a real implementation, you'd fetch from the GraphQL API
      // const result = await graphqlClient.request(MEDIA_FILES_QUERY);
      // setMediaFiles(result.mediaFiles);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (mediaFile: MediaFile) => {
    setMediaFiles(prev => [mediaFile, ...prev]);
    setShowUploadModal(false);
  };

  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(id);
        setMediaFiles(prev => prev.filter(file => file.id !== id));
        setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      try {
        await Promise.all(selectedFiles.map(id => deleteFile(id)));
        setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || file.folder.includes(selectedFolder);
    return matchesSearch && matchesFolder;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your images and media files
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Folders</h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.path}
                    onClick={() => setSelectedFolder(folder.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedFolder === folder.path
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Folder className="w-4 h-4 mr-2" />
                      {folder.name}
                    </div>
                    <span className="text-xs text-gray-400">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete ({selectedFiles.length})
                    </button>
                  )}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Files Display */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading files...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedFolder !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Upload your first media file to get started.'
                    }
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`relative group bg-white border-2 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${
                        selectedFiles.includes(file.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {file.contentType.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {selectedFiles.includes(file.id) && (
                        <div className="absolute top-2 left-2">
                          <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer ${
                        selectedFiles.includes(file.id) ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-4">
                        {file.contentType.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.originalName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.url, '_blank');
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upload Media Files</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Upload images and other media files to your library
                </p>
              </div>
              <div className="p-6">
                <MediaUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadError={(error) => console.error('Upload error:', error)}
                  folder="general"
                  multiple={true}
                  maxFiles={10}
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
