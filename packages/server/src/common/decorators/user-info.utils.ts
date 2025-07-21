import { IUser } from "@kflow-struct/share";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";



/**
 * User Information Data
 */
export type TCurrentUser=Omit<IUser,'password'>;
  

/**
 * Decorator to get the user's information from the request
 * Frontend pass token
 * Backend verify token, parse token and add user information to request
 */  
const getUserInfo = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


export { getUserInfo };
