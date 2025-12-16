import { bucket } from '../config/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Storage Service
 * Handles file uploads, downloads, and deletions from Google Cloud Storage
 */

interface UploadFileOptions {
  buffer: Buffer;
  originalName: string;
  mimetype: string;
  folder?: string; // e.g., 'submissions', 'cropped'
}

/**
 * Upload a file to GCS and return the public URL
 */
export async function uploadFile(options: UploadFileOptions): Promise<string> {
  const { buffer, originalName, mimetype, folder = 'uploads' } = options;

  // Generate unique filename
  const ext = path.extname(originalName);
  const filename = `${uuidv4()}${ext}`;
  const filepath = folder ? `${folder}/${filename}` : filename;

  const file = bucket.file(filepath);

  // Upload the file
  await file.save(buffer, {
    contentType: mimetype,
    metadata: {
      metadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  // Make the file public (optional - you can also use signed URLs)
  await file.makePublic();

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${filepath}`;
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: UploadFileOptions[]
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from GCS
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split(`${bucket.name}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    
    const filepath = urlParts[1];
    const file = bucket.file(filepath);

    await file.delete();
    console.log(`🗑️  Deleted file: ${filepath}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete multiple files
 */
export async function deleteMultipleFiles(fileUrls: string[]): Promise<void> {
  const deletePromises = fileUrls.map((url) => deleteFile(url));
  await Promise.all(deletePromises);
}

/**
 * Generate a signed URL for temporary access to a file
 * Useful if you don't want to make files public
 */
export async function getSignedUrl(
  fileUrl: string,
  expirationMinutes: number = 60
): Promise<string> {
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split(`${bucket.name}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    
    const filepath = urlParts[1];
    const file = bucket.file(filepath);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expirationMinutes * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

/**
 * Check if a file exists in GCS
 */
export async function fileExists(fileUrl: string): Promise<boolean> {
  try {
    const urlParts = fileUrl.split(`${bucket.name}/`);
    if (urlParts.length < 2) {
      return false;
    }
    
    const filepath = urlParts[1];
    const file = bucket.file(filepath);
    const [exists] = await file.exists();
    
    return exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

/**
 * Validate file type
 */
export function validateFileType(
  mimetype: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      // Handle wildcard types like 'image/*'
      const baseType = type.split('/')[0];
      return mimetype.startsWith(`${baseType}/`);
    }
    return mimetype === type;
  });
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(
  size: number,
  maxSizeMB: number
): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

// Common file type validators
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
];

export const MAX_IMAGE_SIZE_MB = 10; // 10 MB
export const MAX_VIDEO_SIZE_MB = 100; // 100 MB

