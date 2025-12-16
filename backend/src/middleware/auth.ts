import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

// Extend Express Request type to include admin data
declare global {
  namespace Express {
    interface Request {
      admin?: {
        admin_id: number;
        account_ids: number[];
        username: string;
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Verify session in Redis
    const session = await authService.verifySession(token);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
    }

    // Attach admin data to request
    req.admin = session;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}