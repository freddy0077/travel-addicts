import { useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GENERATE_PRESIGNED_UPLOAD_URL_MUTATION, CREATE_MEDIA_FILE_MUTATION, DELETE_MEDIA_FILE_MUTATION, SERVER_UPLOAD_FILE_MUTATION } from '@/lib/graphql-client';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  key: string;
  size: number;
  contentType: string;
  folder: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UseMediaUploadResult {
  uploadFile: (file: File, folder?: string) => Promise<MediaFile>;
  deleteFile: (id: string) => Promise<boolean>;
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
}

export function useMediaUpload(): UseMediaUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create authenticated GraphQL client
  const getAuthenticatedClient = () => {
    const token = localStorage.getItem('adminToken');
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
    
    return new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  const uploadFile = async (file: File, folder?: string): Promise<MediaFile> => {
    setUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const client = getAuthenticatedClient();

      // Try presigned URL upload first
      try {
        // Step 1: Generate presigned URL
        const presignedResult = await client.request(GENERATE_PRESIGNED_UPLOAD_URL_MUTATION, {
          input: {
            filename: file.name,
            contentType: file.type,
            folder: folder || 'general'
          }
        });

        const { uploadUrl, key, publicUrl } = presignedResult.generatePresignedUploadUrl;

        // Step 2: Upload file to S3 using presigned URL
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        setProgress({ loaded: file.size, total: file.size, percentage: 100 });

        // Step 3: Create media file record in database
        const mediaFileResult = await client.request(CREATE_MEDIA_FILE_MUTATION, {
          input: {
            filename: key.split('/').pop() || file.name,
            originalName: file.name,
            url: publicUrl,
            key: key,
            size: file.size,
            contentType: file.type,
            folder: folder || 'general'
          }
        });

        return mediaFileResult.createMediaFile;
      } catch (corsError: any) {
        // If CORS error or fetch failed, fall back to server-side upload
        console.log('Presigned URL upload failed, falling back to server upload:', corsError.message);
        
        // Convert file to base64
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        setProgress({ loaded: file.size * 0.5, total: file.size, percentage: 50 });

        // Upload via server
        const serverUploadResult = await client.request(SERVER_UPLOAD_FILE_MUTATION, {
          input: {
            filename: file.name,
            contentType: file.type,
            folder: folder || 'general',
            fileData: fileData
          }
        });

        setProgress({ loaded: file.size, total: file.size, percentage: 100 });

        return serverUploadResult.serverUploadFile;
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const deleteFile = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const client = getAuthenticatedClient();
      const result = await client.request(DELETE_MEDIA_FILE_MUTATION, { id });
      return result.deleteMediaFile;
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Delete failed');
      throw err;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
    error
  };
}

// Utility functions for file validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
