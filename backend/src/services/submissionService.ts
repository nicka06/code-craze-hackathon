import prisma from '../config/prisma';
import * as emailService from './emailService';
import * as storageService from './storageService';

/**
 * Submission Service
 * Handles business logic for user submissions
 */

interface CreateSubmissionData {
  account_id: number;
  caption: string;
  email: string;
  instagram_username?: string;
  files: Express.Multer.File[];
}

/**
 * Create a new submission
 */
export async function createSubmission(data: CreateSubmissionData) {
  const { account_id, caption, email, instagram_username, files } = data;

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

  // Upload files to GCS
  const mediaUrls = await Promise.all(
    files.map(file =>
      storageService.uploadFile({
        buffer: file.buffer,
        originalName: file.originalname,
        mimetype: file.mimetype,
        folder: 'submissions',
      })
    )
  );

  // Create post in database
  const post = await prisma.post.create({
    data: {
      account_id,
      caption,
      email,
      media: mediaUrls,
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

  // Send confirmation email to user
  try {
    await emailService.sendSubmissionConfirmation(email, {
      accountName: account.instagram_username,
      submissionId: post.id.toString(),
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't fail the submission if email fails
  }

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