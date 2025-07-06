import { Injectable } from '@nestjs/common';
import { textMessageConfig } from 'config';

/**
 * text message tool
 */
@Injectable()
export class TextMessageTool {
    async sendMsgCode(phone: string, randomCode: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // send sms based on third-party service
        const result = await fetch('https://api-v2.xdclass.net/send_sms', {
            headers,
            method: 'post',
            body: JSON.stringify({
                ...textMessageConfig,
                code: randomCode,
                phoneNum: phone,
                templateCode: 'SMS_168781429',
            }),
        });
        return result.json();
    }
}