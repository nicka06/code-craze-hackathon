import { Storage } from '@google-cloud/storage';

/**
 * Google Cloud Storage configuration
 * On Cloud Run, this will automatically use the service account credentials
 * For local development, set GCS_KEY_FILE_PATH in .env
 */

const storageOptions: any = {};

// Use key file for local development
if (process.env.GCS_KEY_FILE_PATH) {
  storageOptions.keyFilename = process.env.GCS_KEY_FILE_PATH;
}

// Set project ID if provided (optional on Cloud Run)
if (process.env.GCS_PROJECT_ID) {
  storageOptions.projectId = process.env.GCS_PROJECT_ID;
}

const storage = new Storage(storageOptions);

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export default storage;

