import { Injectable } from '@nestjs/common';
import { textMessageConfig, twilioConfig } from 'config';
import { Twilio } from 'twilio';

/**
 * text message tool
 */
@Injectable()
export class TextMessageTool {
    private twilioClient: Twilio;

    constructor() {
        this.twilioClient = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);
    }

    normalizePhone(phone: string): string {
        if (phone.startsWith('+1')) return phone;
        if (phone.startsWith('1') && phone.length === 11) return `+${phone}`;
        if (phone.length === 10) return `+1${phone}`;
        return phone;
    }

    async sendMsgCode(phone: string, code: number): Promise<{ code: number; msg: string }> {
        const toPhone = this.normalizePhone(phone);
        try {
            const message = await this.twilioClient.messages.create({
                body: `[KFlowStruct] Your verification code is ${code}. Do not share this code with anyone.`,
                from: twilioConfig.fromPhone,
                to: toPhone,
            });

            console.log(`Twilio SMS sent to ${toPhone}: ${message.sid}`);

            return { code: 0, msg: 'SMS sent successfully' };
        } catch (error: any) {
            console.error('Twilio SMS error:', error.message);
            return { code: -1, msg: `Failed to send SMS: ${error.message}` };
        }
    }

    // async sendMsgCodeXD(phone: string, randomCode: number) {
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     // send sms based on third-party service
    //     const result = await fetch('https://api-v2.xdclass.net/send_sms', {
    //         headers,
    //         method: 'post',
    //         body: JSON.stringify({
    //             ...textMessageConfig,
    //             code: randomCode,
    //             phoneNum: phone,
    //             templateCode: 'SMS_168781429',
    //         }),
    //     });
    //     return result.json();
    // }


}