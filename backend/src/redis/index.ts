import Redis from 'ioredis';
import env from '@/config/default';

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = env();

// Mock Redis client for development when Redis is not available
class MockRedis {
  private storage: Map<string, string> = new Map();
  private sets: Map<string, Set<string>> = new Map();

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async incr(key: string): Promise<number> {
    const current = parseInt(this.storage.get(key) || '0');
    const newValue = current + 1;
    this.storage.set(key, newValue.toString());
    return newValue;
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return keys.map(key => this.storage.get(key) || null);
  }

  async keys(pattern: string): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async type(key: string): Promise<string> {
    if (this.sets.has(key)) return 'set';
    if (this.storage.has(key)) return 'string';
    return 'none';
  }

  async sadd(key: string, values: number[] | string[]): Promise<number> {
    if (!this.sets.has(key)) {
      this.sets.set(key, new Set());
    }
    const set = this.sets.get(key)!;
    let added = 0;
    values.forEach(value => {
      const strValue = value.toString();
      if (!set.has(strValue)) {
        set.add(strValue);
        added++;
      }
    });
    return added;
  }

  async smembers(key: string): Promise<string[]> {
    const set = this.sets.get(key);
    return set ? Array.from(set) : [];
  }

  async srem(key: string, values: string[]): Promise<number> {
    const set = this.sets.get(key);
    if (!set) return 0;
    let removed = 0;
    values.forEach(value => {
      if (set.delete(value)) {
        removed++;
      }
    });
    return removed;
  }

  async expire(key: string, seconds: number): Promise<void> {
    // Mock implementation - in real Redis this would set TTL
    // For mock, we'll just ignore it
  }
}

// Try to connect to Redis, fall back to mock if unavailable
let redisClient: Redis | MockRedis;

try {
  redisClient = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
    db: REDIS_DB,
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  // Test connection
  redisClient.ping().catch(() => {
    console.warn('[WARN] Redis connection failed, using mock Redis client');
    redisClient = new MockRedis();
  });
} catch (error) {
  console.warn('[WARN] Redis initialization failed, using mock Redis client');
  redisClient = new MockRedis();
}

export default redisClient as Redis;
