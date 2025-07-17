import type { IUser } from "..";


export interface CaptchaRequest {
    type: "register" | "login"
}

/**
 * RegisterRequest is a type that represents the request body for the register endpoint
 */
export type RegisterRequest = Pick<IUser, "phone" | "password"> & {
    smsCode: string,
    confirmPassword: string,
}


export type SmsCodeRequest =
    Pick<IUser, "phone"> &
    { captcha: string } &
    CaptchaRequest


export type LoginWithPasswordRequest = Pick<IUser, "phone" | "password">


export type LoginWithCodeRequest = Pick<IUser, "phone"> & {
    smsCode: string
}


