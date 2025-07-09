import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig, redisConfig, jwtConfig } from '../config';
import { UserModule } from './user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    JwtModule.register(jwtConfig),
    UserModule,
    { ...TypeOrmModule.forFeature([User]), global: true }
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
