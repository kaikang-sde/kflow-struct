import type { LoginWithCodeRequest, LoginWithPasswordRequest, RegisterRequest, SmsCodeRequest } from "@kflow-struct/share";
import request from "../utils/request";


/** getCaptcha is a function that gets a captcha
 * @param data {type: register}
 * @returns 
 */
export async function getCaptcha(data: { type: string }) {
    return request(`/user/captcha`, {
        data,
        method: "POST",
    });
}


export async function getSmsCode(data: SmsCodeRequest) {
    return await request(`/user/sms-code`, {
        data,
        method: "POST",
    });
}


export async function getRegister(data: RegisterRequest) {
    return request("/user/signup", {
        data,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
}


/**
 * login with password
 */
export async function getLoginWithPassword(data: LoginWithPasswordRequest) {
    return request("/user/login/password", {
      data,
      method: "POST",
    });
}

/**
 * sms login
 */
export async function getLoginWithCode(data: LoginWithCodeRequest) {
    return request("/user/login/sms", {
      data,
      method: "POST",
    });
}
  