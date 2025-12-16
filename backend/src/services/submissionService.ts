import prisma from '../config/prisma';

/**
 * Submission Service
 * Handles business logic for user submissions
 */

interface CreateSubmissionData {
  account_id: number;
  caption: string;
  email: string;
  media: string[];
  instagram_username?: string;
}

/**
 * Create a new submission
 */
export async function createSubmission(data: CreateSubmissionData) {
  const { account_id, caption, email, media, instagram_username } = data;

  // Validate account exists and is active
  const account = await prisma.account.findUnique({
    where: { id: account_id },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  if (!account.is_active) {
    throw new Error('This account is not accepting submissions');
  }

  // Create post in database
  const post = await prisma.post.create({
    data: {
      account_id,
      caption,
      email,
      media,
      instagram_username: instagram_username || null,
      status: 'pending',
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

  return post;
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
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
    throw new Error('Submission not found');
  }

  return post;
}