import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { StrategyOptions } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConfig } from 'config';
import { User } from '../user/entities/user.entity';

/** NestJS + Passport + JWT 
 * JWT Strategy: verify token sent by client is valid, is not expired, and user exists
 * Strategy: passport-jwt strategy
 * 'jwt': give the strategy a name, can be any string. Can be used by @UseGuards(AuthGuard('jwt')) to apply the strategy
 */
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    /** User repository
     * inject user entity repository for user database query
     */
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
        super({
            /**
             * secretOrKey: jwt secret, used to verify token
             * jwtFromRequest: jwt from request, used to extract token from request
             */
            secretOrKey: jwtConfig.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        } as StrategyOptions);
    }


    /**
     * verify token
     * @param data 
     * @returns 
     */
    async validate(data: { id: number; iat: number; exp: number }) {
        if (!data) throw new UnauthorizedException('Please login first!');

        if (data.exp - data.iat <= 0)
            throw new UnauthorizedException('Token is expired! Please login again!');

        const user = await this.userRepository.findOne({ where: { id: data.id } });
        if (!user) throw new UnauthorizedException('Error! Please login again!');

        return { ...user, password: '' };
    }
}