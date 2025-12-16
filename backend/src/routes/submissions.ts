import { Router, Request, Response } from 'express';
import * as submissionService from '../services/submissionService';

const router = Router();

/**
 * POST /api/submissions
 * Create a new submission
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      account_id,
      caption,
      email,
      media,
      instagram_username,
    } = req.body;

    // Validate required fields
    if (!account_id || !caption || !email || !media) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['account_id', 'caption', 'email', 'media'],
      });
    }

    // Validate media is array
    if (!Array.isArray(media) || media.length === 0) {
      return res.status(400).json({
        error: 'Media must be a non-empty array',
      });
    }

    // Validate media count (max 10)
    if (media.length > 10) {
      return res.status(400).json({
        error: 'Maximum 10 media files allowed',
      });
    }

    // Call service
    const post = await submissionService.createSubmission({
      account_id: parseInt(account_id),
      caption,
      email,
      media,
      instagram_username,
    });

    // Success response
    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: {
        id: post.id,
        status: post.status,
        account: post.account.instagram_username,
        created_at: post.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating submission:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('not accepting')) {
        return res.status(404).json({ error: error.message });
      }
    }

    res.status(500).json({
      error: 'Failed to create submission',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/submissions/:id
 * Get submission by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await submissionService.getSubmissionById(parseInt(req.params.id));
    res.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

export default router;