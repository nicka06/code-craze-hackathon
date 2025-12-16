/**
 * Scheduler Service
 * Called by Google Cloud Scheduler every 30 minutes to publish approved posts
 */

import { postingService } from './postingService';

/**
 * Main scheduler function - publishes the next approved post
 * This is called by Google Cloud Scheduler via webhook
 */
export async function runScheduledPosting(): Promise<void> {
  console.log('⏰ Scheduler triggered - checking for approved posts...');
  await postingService.publishNextApprovedPost();
}

export const schedulerService = {
  runScheduledPosting,
};

