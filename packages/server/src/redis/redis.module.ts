import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Module({})
export class RedisModule {
    // Redis instance
    private redis: Redis;

    // Create a new Redis instance based on the Redis options/config
    constructor(options: RedisOptions) {
        this.redis = new Redis(options);
    }

    // Module is static by default. forRoot is a static method that returns a DynamicModule
    // Create a new dynamic RedisModule instance since we need pass the options/config to the module
    static forRoot(options: RedisOptions): DynamicModule {
        const providers: Provider[] = [
            {
                provide: RedisModule,
                useValue: new RedisModule(options),
            },
        ];

        return {
            providers,
            global: true,
            exports: providers,
            module: RedisModule,
        };
    }

    // Set a key-value pair in Redis with optional expiration time
    set(key: string, value: string, time?: number) {
        time ? this.redis.set(key, value, 'EX', time) : this.redis.set(key, value);
    }

    // Delete a key from Redis
    del(key: string) {
        this.redis.del(key);
    }

    // Get a value from Redis by key
    async get(key: string) {
        const value = await this.redis.get(key);
        return value ? value.toString() : null;
    }

    // Check if a key exists in Redis
    async exists(key: string) {
        const result = await this.redis.exists(key);
        return result;
    }
}