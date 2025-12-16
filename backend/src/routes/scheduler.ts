/**
 * Scheduler Routes
 * Webhook endpoint for Google Cloud Scheduler
 */

import { Router, Request, Response } from 'express';
import { schedulerService } from '../services/schedulerService';

const router = Router();

/**
 * POST /api/scheduler/trigger
 * Webhook endpoint for Google Cloud Scheduler
 * Publishes the next approved post
 * 
 * Authentication: Requires SCHEDULER_SECRET in Authorization header
 */
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    // Verify scheduler secret
    const authHeader = req.headers.authorization;
    const schedulerSecret = process.env.SCHEDULER_SECRET;

    if (!schedulerSecret) {
      console.error('⚠️  SCHEDULER_SECRET not configured');
      return res.status(500).json({ error: 'Scheduler not configured' });
    }

    if (!authHeader || authHeader !== `Bearer ${schedulerSecret}`) {
      console.warn('❌ Unauthorized scheduler request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Run the scheduled posting
    await schedulerService.runScheduledPosting();

    res.json({
      success: true,
      message: 'Scheduler executed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in scheduler trigger:', error);
    res.status(500).json({ 
      error: 'Scheduler execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

