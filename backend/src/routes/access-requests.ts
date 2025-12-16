import { Router, Request, Response } from 'express';
import prisma from '../config/prisma';

const router = Router();

/**
 * POST /api/access-requests
 * Submit a request for admin access
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'message'],
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        error: 'Message must be at least 10 characters',
      });
    }

    // Create access request
    const accessRequest = await prisma.adminRequest.create({
      data: {
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });

    // TODO: Send notification email to admin
    // await emailService.sendAccessRequestNotification(accessRequest);

    res.status(201).json({
      success: true,
      message: 'Access request submitted successfully',
      data: {
        id: accessRequest.id,
        email: accessRequest.email,
        created_at: accessRequest.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating access request:', error);
    res.status(500).json({
      error: 'Failed to submit access request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/access-requests
 * Get all access requests (admin only - could add auth later)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.adminRequest.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching access requests:', error);
    res.status(500).json({ error: 'Failed to fetch access requests' });
  }
});

export default router;