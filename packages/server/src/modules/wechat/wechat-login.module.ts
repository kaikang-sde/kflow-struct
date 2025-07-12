import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';

export interface WechatLoginModuleConfig {
    appId: string;
    appSecret: string;
    token: string;
    qrUrl: string;
}

@Module({})
export class WechatLoginToolModule {
    private config: WechatLoginModuleConfig;
    private accessTokenPC: string;
    token: string;
    constructor(config: WechatLoginModuleConfig) {
        this.config = config;
        this.token = config.token;
        this.accessTokenPC = `https://api-v2.xdclass.net/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`;
    }

    static forRoot(options: WechatLoginModuleConfig): DynamicModule {
        const providers = [
            {
                provide: WechatLoginToolModule,
                useValue: new WechatLoginToolModule(options),
            },
        ]
        return {
            providers,
            global: true,
            exports: providers,
            module: WechatLoginToolModule,
        };
    }


    /** Wechat Service access_token retrieval
     * 
     */
    async getAccessToken() {
        const response = await fetch(this.accessTokenPC);
        return response.json()
    }

    /** Wechat Service ticket retrieval
     * After get access_token, use it to get ticket
     * @param token 
     * @returns 
     */
    async getTicket(token: string) {
        const response = await fetch(
            `https://api-v2.xdclass.net/cgi-bin/qrcode/create?access_token=${token}`,
            {
                method: 'post',
                body: JSON.stringify({
                    expire_seconds: 60 * 2,
                    action_name: 'QR_SCENE',
                    action_info: {
                        scene: { scene_id: 123 },
                    },
                }),
            },
        )
        return response.json()
    }

    /** Wechat Service QR code retrieval
     * After get ticket, use it to get QR code
     * @returns 
     */
    async getQRCode() {
        const token = (await this.getAccessToken()).access_token
        const ticket = (await this.getTicket(token)).ticket
        return { qrCodeUrl: `${this.config.qrUrl}?ticket=${ticket}`, ticket }
    }











}



