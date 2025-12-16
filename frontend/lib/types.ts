/**
 * Shared TypeScript types
 * Duplicated from backend for frontend use
 */

export interface Post {
  id: number;
  account_id: number;
  caption: string;
  media: string[];
  email: string;
  instagram_username?: string | null;
  status: 'pending' | 'approved' | 'declined' | 'posted' | 'failed';
  created_at: string;
  posted_at?: string | null;
  declined_message?: string | null;
  error_message?: string | null;
  account?: {
    id: number;
    instagram_username: string;
  };
}

export interface Account {
  id: number;
  slug?: string;
  instagram_username: string;
  instagram_id: string;
  facebook_id: string;
  is_active: boolean;
}

export interface Admin {
  id: number;
  username: string;
  account_ids: number[];
}

export interface AdminRequest {
  id: number;
  email: string;
  message: string;
  created_at: string;
}

export interface PostStats {
  pending: number;
  approved: number;
  declined: number;
  posted: number;
  failed: number;
  total: number;
}

