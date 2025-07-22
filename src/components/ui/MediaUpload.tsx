'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, Check } from 'lucide-react';
import { useMediaUpload, validateImageFile, formatFileSize, MediaFile } from '@/hooks/useMediaUpload';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  onUploadComplete?: (mediaFile: MediaFile) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  accept?: string;
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

export default function MediaUpload({
  onUploadComplete,
  onUploadError,
  folder = 'general',
  accept = 'image/*',
  maxFiles = 1,
  multiple = false,
  className,
  disabled = false,
  showPreview = true
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading, progress, error } = useMediaUpload();

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files).slice(0, maxFiles);
    
    for (const file of filesToUpload) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onUploadError?.(validation.error || 'Invalid file');
        continue;
      }

      try {
        const mediaFile = await uploadFile(file, folder);
        setUploadedFiles(prev => [...prev, mediaFile]);
        onUploadComplete?.(mediaFile);
      } catch (err: any) {
        onUploadError?.(err.message || 'Upload failed');
      }
    }
  }, [uploadFile, folder, maxFiles, onUploadComplete, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles, disabled, uploading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  }, [disabled, uploading]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          uploading && "pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Uploading...</p>
                {progress && (
                  <div className="mt-2 w-full max-w-xs">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progress.percentage.toFixed(0)}% - {formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Preview Area */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="relative group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {file.contentType.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified version for single image upload
interface SingleImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImage?: string;
  folder?: string;
  className?: string;
}

export function SingleImageUpload({
  onImageSelect,
  currentImage,
  folder = 'general',
  className
}: SingleImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);

  const handleUploadComplete = (mediaFile: MediaFile) => {
    setSelectedImage(mediaFile.url);
    onImageSelect(mediaFile.url);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {selectedImage && (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => {
              setSelectedImage(null);
              onImageSelect('');
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {!selectedImage && (
        <MediaUpload
          onUploadComplete={handleUploadComplete}
          folder={folder}
          maxFiles={1}
          showPreview={false}
          className="h-48"
        />
      )}
    </div>
  );
}
