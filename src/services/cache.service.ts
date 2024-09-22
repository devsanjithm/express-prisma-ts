import * as redis from 'redis';
import config from '../config/config.js';

let redisClient: redis.RedisClientType;
let isReady: boolean;

async function createRedisClient(): Promise<redis.RedisClientType> {
  redisClient = redis.createClient({
    url: config.redis.url
  });

  redisClient.on('error', (error) => {
    console.error(`Redis Error: ${error}`);
  });
  redisClient.on('connect', () => {
    console.info('Redis connected');
  });
  redisClient.on('reconnecting', () => {
    console.info('Redis reconnecting');
  });
  redisClient.on('ready', () => {
    isReady = true;
    console.info('Redis ready!');
  });

  await redisClient.connect();

  return redisClient;
}

async function getRedisClient(): Promise<redis.RedisClientType> {
  if (!isReady) {
    redisClient = await createRedisClient();
  }

  return redisClient;
}

async function getFromCache(
  key: string
): Promise<string | Record<string, unknown> | number | undefined> {
  const client = await getRedisClient();
  const value = await client.get(key);
  return JSON.parse(value || '');
}

async function setToCache(
  key: string,
  value: Record<string, unknown> | string | number
): Promise<void | string | undefined> {
  const client = await getRedisClient();
  return client.set(key, JSON.stringify(value)) as unknown as Promise<void | string | undefined>;
}

export default {
  getFromCache,
  setToCache,
  createRedisClient
};
