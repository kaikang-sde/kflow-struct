import { Injectable } from "@nestjs/common";
import { createHash } from 'node:crypto';

@Injectable()
export class SecretTool {
    getSecret(data: string) {
        // Create an md5 hash of the data, return the hex value
        return createHash('md5').update(data).digest('hex');
    }
}