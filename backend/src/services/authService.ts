import prisma from '../config/prisma';
import redisClient from '../config/redis';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

interface LoginData {
  username: string;
  password: string;
}

interface SessionData {
  admin_id: number;
  account_ids: number[];
  username: string;
}

/**
 * Login admin and create session
 */
export async function login(data: LoginData) {
  const { username, password } = data;

  // Find admin by username
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, admin.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');

  // Store session in Redis
  const sessionData: SessionData = {
    admin_id: admin.id,
    account_ids: admin.account_ids,
    username: admin.username,
  };

  await redisClient.setEx(
    `${SESSION_PREFIX}${token}`,
    SESSION_EXPIRY,
    JSON.stringify(sessionData)
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      account_ids: admin.account_ids,
    },
  };
}

/**
 * Verify session token
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  const sessionKey = `${SESSION_PREFIX}${token}`;
  const data = await redisClient.get(sessionKey);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as SessionData;
}

/**
 * Logout - destroy session
 */
export async function logout(token: string): Promise<void> {
  const sessionKey = `${SESSION_PREFIX}${token}`;
  await redisClient.del(sessionKey);
}