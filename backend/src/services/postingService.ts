/**
 * Posting Service
 * Handles publishing approved posts to Instagram via Meta Graph API
 */

import prisma from '../config/prisma';
import * as emailService from './emailService';

// Meta Graph API configuration
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface MediaItem {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface PostResult {
  success: boolean;
  instagram_post_id?: string;
  error?: string;
}

/**
 * Publishes a single image to Instagram
 */
async function publishSingleImage(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<PostResult> {
  try {
    // Step 1: Create media container
    const containerResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to create media container');
    }

    const { id: containerId } = await containerResponse.json() as { id: string };

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to publish media');
    }

    const { id: postId } = await publishResponse.json() as { id: string };

    return { success: true, instagram_post_id: postId };
  } catch (error: any) {
    console.error('Error publishing single image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publishes a carousel (multiple images/videos) to Instagram
 */
async function publishCarousel(
  igUserId: string,
  accessToken: string,
  mediaItems: MediaItem[],
  caption: string
): Promise<PostResult> {
  try {
    // Step 1: Create containers for each media item
    const containerIds: string[] = [];

    for (const media of mediaItems) {
      const response = await fetch(
        `${GRAPH_API_BASE_URL}/${igUserId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [media.type === 'IMAGE' ? 'image_url' : 'video_url']: media.url,
            is_carousel_item: true,
            access_token: accessToken,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json() as any;
        throw new Error(error.error?.message || 'Failed to create carousel item');
      }

      const { id } = await response.json() as { id: string };
      containerIds.push(id);
    }

    // Step 2: Create carousel container
    const carouselResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: containerIds,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!carouselResponse.ok) {
      const error = await carouselResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to create carousel container');
    }

    const { id: carouselContainerId } = await carouselResponse.json() as { id: string };

    // Step 3: Publish the carousel
    const publishResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: carouselContainerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to publish carousel');
    }

    const { id: postId } = await publishResponse.json() as { id: string };

    return { success: true, instagram_post_id: postId };
  } catch (error: any) {
    console.error('Error publishing carousel:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publishes a single video to Instagram
 */
async function publishSingleVideo(
  igUserId: string,
  accessToken: string,
  videoUrl: string,
  caption: string
): Promise<PostResult> {
  try {
    // Step 1: Create video container
    const containerResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'VIDEO',
          video_url: videoUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to create video container');
    }

    const { id: containerId } = await containerResponse.json() as { id: string };

    // Step 2: Poll for video processing completion
    const maxAttempts = 30; // 30 attempts = ~5 minutes
    let attempts = 0;
    let statusCode = '';

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `${GRAPH_API_BASE_URL}/${containerId}?fields=status_code&access_token=${accessToken}`
      );

      if (!statusResponse.ok) {
        throw new Error('Failed to check video status');
      }

      const { status_code } = await statusResponse.json() as { status_code: string };
      statusCode = status_code;

      if (statusCode === 'FINISHED') {
        break;
      } else if (statusCode === 'ERROR') {
        throw new Error('Video processing failed');
      }

      // Wait 10 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 10000));
      attempts++;
    }

    if (statusCode !== 'FINISHED') {
      throw new Error('Video processing timeout');
    }

    // Step 3: Publish the video
    const publishResponse = await fetch(
      `${GRAPH_API_BASE_URL}/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json() as any;
      throw new Error(error.error?.message || 'Failed to publish video');
    }

    const { id: postId } = await publishResponse.json() as { id: string };

    return { success: true, instagram_post_id: postId };
  } catch (error: any) {
    console.error('Error publishing single video:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main function to publish a post to Instagram
 * Determines media type and uses the appropriate publishing method
 */
export async function publishPost(postId: number): Promise<PostResult> {
  try {
    // Fetch post with account details
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { account: true },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.status !== 'approved') {
      throw new Error('Only approved posts can be published');
    }

    if (!post.account.is_active) {
      throw new Error('Account is not active');
    }

    const { account, caption, media } = post;
    const { instagram_id, access_token } = account;

    if (!instagram_id || !access_token) {
      throw new Error('Account missing Instagram credentials');
    }

    // Determine media type
    const mediaItems: MediaItem[] = media.map((url: string) => ({
      url,
      type: url.toLowerCase().match(/\.(mp4|mov)$/) ? 'VIDEO' : 'IMAGE',
    }));

    const hasVideo = mediaItems.some((item) => item.type === 'VIDEO');
    const hasMultiple = mediaItems.length > 1;

    let result: PostResult;

    // Publish based on media type
    if (hasMultiple && hasVideo) {
      // Carousel with video
      result = await publishCarousel(instagram_id, access_token, mediaItems, caption);
    } else if (hasMultiple) {
      // Carousel with images only
      result = await publishCarousel(instagram_id, access_token, mediaItems, caption);
    } else if (hasVideo) {
      // Single video
      result = await publishSingleVideo(instagram_id, access_token, mediaItems[0].url, caption);
    } else {
      // Single image
      result = await publishSingleImage(instagram_id, access_token, mediaItems[0].url, caption);
    }

    // Update post status in database
    if (result.success) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'posted',
          instagram_post_id: result.instagram_post_id as string,
          posted_at: new Date(),
        } as any,
      });

      // Send success email
      try {
        await emailService.sendPostSuccessEmail(
          post.email,
          post.instagram_username || 'User',
          result.instagram_post_id!
        );
      } catch (emailError) {
        console.error('Failed to send success email:', emailError);
      }

      console.log(`✅ Post ${postId} published successfully`);
    } else {
      // Update post status to failed
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'failed',
        },
      });

      // Send failure email
      try {
        await emailService.sendPostFailureEmail(
          post.email,
          post.instagram_username || 'User',
          result.error || 'Unknown error'
        );
      } catch (emailError) {
        console.error('Failed to send failure email:', emailError);
      }

      console.error(`❌ Post ${postId} failed to publish:`, result.error);
    }

    return result;
  } catch (error: any) {
    console.error('Error in publishPost:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publishes all approved posts that haven't been posted yet
 * Used by the scheduler
 */
export async function publishNextApprovedPost(): Promise<void> {
  try {
    // Find the oldest approved post
    const post = await prisma.post.findFirst({
      where: { status: 'approved' },
      orderBy: { created_at: 'asc' },
    });

    if (!post) {
      console.log('No approved posts to publish');
      return;
    }

    console.log(`Publishing post ${post.id}...`);
    await publishPost(post.id);
  } catch (error) {
    console.error('Error in publishNextApprovedPost:', error);
  }
}

export const postingService = {
  publishPost,
  publishNextApprovedPost,
};

