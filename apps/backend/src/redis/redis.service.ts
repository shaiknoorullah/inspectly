// redis.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { RedisOptions } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redisClient: Redis
  public pubClient: Redis
  public subClient: Redis

  private setupEventListeners(client: Redis) {
    client.on('connect', () => {
      console.info('Connected to Redis server')
    })
    client.on('error', (error: unknown) => {
      console.error('Error connecting to Redis:', error)
    })
  }

  constructor(private readonly configService: ConfigService) {
    const redisOptions: RedisOptions = {
      host: this.configService.get<string>('REDIS_HOST', '127.0.0.1'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'), // It's fine if this is undefined
    }
    this.redisClient = new Redis(redisOptions)
    this.pubClient = new Redis(redisOptions) // Client for publishing
    this.subClient = new Redis(redisOptions) // Client for subscribing

    this.setupEventListeners(this.redisClient)
    this.setupEventListeners(this.pubClient)
    this.setupEventListeners(this.subClient)
    // Optionally, handle events or errors
    this.redisClient.on('connect', () => {
      console.info('Connected to Redis server')
    })

    this.redisClient.on('error', (error: unknown) => {
      console.error('Error connecting to Redis:', error)
    })
  }

  onModuleInit() {
    // This method will be empty if you are initializing the adapter elsewhere,
    // e.g., directly in the WebSocket gateway or a dedicated real-time module.
  }

  // Example method to set a key-value pair in Redis

  async set(
    key: string,
    value: any,
    expiryMode: 'EX' = 'EX',
    time?: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, expiryMode, time || 300)
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key)
  }

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key)
  }
}
