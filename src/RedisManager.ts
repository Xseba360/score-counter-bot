import Redis from 'ioredis'

export class RedisManager {
  private static instance: Redis

  public static getInstance (): Redis {
    if (!RedisManager.instance) {
      RedisManager.instance = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      })
    }
    return RedisManager.instance
  }
}