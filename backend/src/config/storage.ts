import { Storage } from '@google-cloud/storage';

/**
 * Google Cloud Storage configuration
 */

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE_PATH,
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export default storage;

