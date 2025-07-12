import { Injectable } from "@nestjs/common";
import { parseString } from 'xml2js'

@Injectable()
export class WechatDataTool {
    // get xml string
    getXMLStr(req: any) {
        return new Promise((resolve) => {
            let data = '';
            req.on('data', (msg: any) => {
                data += msg.toString();
            })
            req.on('end', () => {
                resolve(data);
            })
        })
    }

    // xml to object
    getObject(data: any) {
        return new Promise((resolve, reject) => {
            parseString(data, (err, result) => {
                if (err)
                    reject(err);
                else resolve(result);
            })
        })
    }

    // convert to normal object
    convertToNormalObject(query: any) {
        const obj: any = {};
        if (query && typeof query === 'object') {
            for (const key in query) {
                const value = query[key];
                if (value && value.length > 0)
                    obj[key] = value[0];
            }
            return obj;
        }
        else {
            return obj;
        }
    }
}    