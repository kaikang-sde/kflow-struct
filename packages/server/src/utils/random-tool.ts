import { Injectable } from '@nestjs/common';

/**
 * @param randomCode random code
 * @param randomAvatar random avatar
 * @param randomName random name
 */
@Injectable()
export class RandomTool {
    randomCode() {
        return Math.floor(Math.random() * (9999 - 1000)) + 1000;
    }

    randomAvatar() {
        const baseImgUrl = (num: number) => {
            const _num = num === 0 ? 1 : num > 19 ? 19 : num;
            return `https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/${_num}.jpeg`;
        };
        return baseImgUrl(Math.floor(Math.random() * 20));
    }

    randomName() {
        return `user${Math.floor(Math.random() * 10000)}`;
    }
}