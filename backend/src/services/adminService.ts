import prisma from '../config/prisma';
import * as emailService from './emailService';

/**
 * Admin Service
 * Handles business logic for admin operations (reviewing posts)
 */

interface GetPostsFilters {
  admin_account_ids: number[];
  status?: 'pending' | 'approved' | 'declined' | 'posted' | 'failed';
}

/**
 * Get posts filtered by admin's account access and optional status
 */
export async function getPosts(filters: GetPostsFilters) {
  const { admin_account_ids, status } = filters;

  const where: any = {
    account_id: {
      in: admin_account_ids,
    },
  };

  if (status) {
    where.status = status;
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      account: {
        select: {
          id: true,
          instagram_username: true,
        },
      },
    },
    orderBy: {
      created_at: 'asc', // Oldest first (for pending review)
    },
  });

  return posts;
}

/**
 * Get a single post by ID (with permission check)
 */
export async function getPostById(id: number, admin_account_ids: number[]) {
  const post = await prisma.post.findFirst({
    where: {
      id,
      account_id: {
        in: admin_account_ids,
      },
    },
    include: {
      account: {
        select: {
          id: true,
          instagram_username: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found or access denied');
  }

  return post;
}

/**
 * Approve a post
 */
export async function approvePost(id: number, admin_account_ids: number[]) {
  // Verify admin has access to this post's account
  const post = await getPostById(id, admin_account_ids);

  if (post.status !== 'pending') {
    throw new Error('Only pending posts can be approved');
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      status: 'approved',
    },
    include: {
      account: {
        select: {
          id: true,
          instagram_username: true,
        },
      },
    },
  });

  // Send approval email to user
  try {
    await emailService.sendApprovalNotification(updatedPost.email, {
      accountName: updatedPost.account.instagram_username,
    });
  } catch (error) {
    console.error('Failed to send approval email:', error);
    // Don't fail the approval if email fails
  }

  return updatedPost;
}

/**
 * Decline a post with a reason
 */
export async function declinePost(
  id: number,
  admin_account_ids: number[],
  declined_message: string
) {
  // Verify admin has access to this post's account
  const post = await getPostById(id, admin_account_ids);

  if (post.status !== 'pending') {
    throw new Error('Only pending posts can be declined');
  }

  if (!declined_message || declined_message.trim().length === 0) {
    throw new Error('Decline message is required');
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      status: 'declined',
      declined_message: declined_message.trim(),
    },
    include: {
      account: {
        select: {
          id: true,
          instagram_username: true,
        },
      },
    },
  });

  // Send decline email to user
  try {
    await emailService.sendDeclineNotification(updatedPost.email, {
      accountName: updatedPost.account.instagram_username,
      declineReason: declined_message.trim(),
    });
  } catch (error) {
    console.error('Failed to send decline email:', error);
    // Don't fail the decline if email fails
  }

  return updatedPost;
}

/**
 * Get post statistics for admin dashboard
 */
export async function getPostStats(admin_account_ids: number[]) {
  const [pending, approved, declined, posted, failed] = await Promise.all([
    prisma.post.count({
      where: { account_id: { in: admin_account_ids }, status: 'pending' },
    }),
    prisma.post.count({
      where: { account_id: { in: admin_account_ids }, status: 'approved' },
    }),
    prisma.post.count({
      where: { account_id: { in: admin_account_ids }, status: 'declined' },
    }),
    prisma.post.count({
      where: { account_id: { in: admin_account_ids }, status: 'posted' },
    }),
    prisma.post.count({
      where: { account_id: { in: admin_account_ids }, status: 'failed' },
    }),
  ]);

  return {
    pending,
    approved,
    declined,
    posted,
    failed,
    total: pending + approved + declined + posted + failed,
  };
}