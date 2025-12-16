import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

let isConnected = false;

redisClient.on('error', (err) => {
  console.log('⚠️  Redis not available:', err.message);
  isConnected = false;
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
  isConnected = true;
});

// Try to connect to Redis (optional - won't crash if unavailable)
redisClient.connect().catch(() => {
  console.log('⚠️  Redis connection failed - auth features will be disabled');
});

// Helper to check if Redis is available
export const isRedisAvailable = () => isConnected;

export default redisClient;