import IORedis from 'ioredis';

const redis = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || 'password',
  maxRetriesPerRequest: null
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

export default redis;
