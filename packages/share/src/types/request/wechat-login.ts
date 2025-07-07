export interface WechatCallbackRequest {
    signature: string;
    timestamp: string;
    nonce: string;
    echostr: string;
}