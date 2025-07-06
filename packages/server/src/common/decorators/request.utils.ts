import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

/**
 * Decorator to get the user's IP address from the request
 * Uses request.ip and matches an IPv4 address pattern
 */
const GetUserIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // Extract IPv4 address from request.ip
  return request.ip?.match(/\d+\.\d+\.\d+\.\d+/)?.join('.');
});

/**
 * Decorator to get the any header from the request headers
 * For example: @GetUserHeader('user-agent')
 */
const GetUserHeader = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[data];
});

export { GetUserIp, GetUserHeader };


