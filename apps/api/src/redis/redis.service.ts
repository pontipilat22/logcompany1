import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor(private configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        this.client = new Redis(redisUrl);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    // Session management for Single Session Policy
    async setSession(userId: string, deviceId: string, token: string, ttl: number): Promise<void> {
        const key = `session:${userId}`;
        await this.client.set(key, JSON.stringify({ deviceId, token }), 'EX', ttl);
    }

    async getSession(userId: string): Promise<{ deviceId: string; token: string } | null> {
        const data = await this.client.get(`session:${userId}`);
        return data ? JSON.parse(data) : null;
    }

    async deleteSession(userId: string): Promise<void> {
        await this.client.del(`session:${userId}`);
    }

    // SMS code storage
    async setSmsCode(phone: string, code: string, ttl: number = 300): Promise<void> {
        await this.client.set(`sms:${phone}`, code, 'EX', ttl);
    }

    async getSmsCode(phone: string): Promise<string | null> {
        return this.client.get(`sms:${phone}`);
    }

    async deleteSmsCode(phone: string): Promise<void> {
        await this.client.del(`sms:${phone}`);
    }

    // Generic methods
    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.set(key, value, 'EX', ttl);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    getClient(): Redis {
        return this.client;
    }
}
