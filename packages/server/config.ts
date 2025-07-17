import { JwtModuleOptions } from '@nestjs/jwt';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { RedisOptions } from 'ioredis';

config();

// MySQL config
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
};

// Redis config
export const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};
  

// Text Message config
export const textMessageConfig = {
    appid: process.env.TEXT_MESSAGE_APP_ID,
    appSecret: process.env.TEXT_MESSAGE_APP_SECRET
};


// Twilio config
export const twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromPhone: process.env.TWILIO_PHONE_NUMBER
};

// JWT config
export const jwtConfig: JwtModuleOptions = {
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: '7d',
    },
    global: true,
};


export const wechatLoginConfig = {
  appId: process.env.WECHAT_APP_ID as string,
  appSecret: process.env.WECHAT_APP_SECRET as string,
  token: process.env.WECHAT_TOKEN as string,
  qrUrl: 'https://mp.weixin.qq.com/cgi-bin/showqrcode'
};
