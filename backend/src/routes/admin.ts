import { Router, Request, Response } from 'express';
import * as adminService from '../services/adminService';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

/**
 * GET /api/admin/posts
 * Get posts filtered by status (defaults to pending)
 */
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as any;
    const admin_account_ids = req.admin!.account_ids;

    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'declined', 'posted', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        valid_statuses: validStatuses,
      });
    }

    const posts = await adminService.getPosts({
      admin_account_ids,
      status: status || 'pending', // Default to pending
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

/**
 * GET /api/admin/posts/stats
 * Get post statistics
 */
router.get('/posts/stats', async (req: Request, res: Response) => {
  try {
    const admin_account_ids = req.admin!.account_ids;
    const stats = await adminService.getPostStats(admin_account_ids);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/admin/posts/:id
 * Get a single post by ID
 */
router.get('/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const admin_account_ids = req.admin!.account_ids;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await adminService.getPostById(id, admin_account_ids);

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

/**
 * PATCH /api/admin/posts/:id/approve
 * Approve a post
 */
router.patch('/posts/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const admin_account_ids = req.admin!.account_ids;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await adminService.approvePost(id, admin_account_ids);

    res.json({
      success: true,
      message: 'Post approved successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Only pending')) {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Error approving post:', error);
    res.status(500).json({ error: 'Failed to approve post' });
  }
});

/**
 * PATCH /api/admin/posts/:id/decline
 * Decline a post with a reason
 */
router.patch('/posts/:id/decline', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const admin_account_ids = req.admin!.account_ids;
    const { declined_message } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    if (!declined_message) {
      return res.status(400).json({ error: 'Decline message is required' });
    }

    const post = await adminService.declinePost(id, admin_account_ids, declined_message);

    res.json({
      success: true,
      message: 'Post declined successfully',
      data: post,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Only pending') || error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Error declining post:', error);
    res.status(500).json({ error: 'Failed to decline post' });
  }
});

export default router;