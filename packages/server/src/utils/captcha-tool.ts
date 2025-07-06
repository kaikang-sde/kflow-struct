import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

/**
 * @param captche generate captcha
 */
@Injectable()
export class CaptchaTool {
  async captche() {
    const captcha = svgCaptcha.create({
      size: 4, // length
      ignoreChars: '0o1i', // exclude characters
      noise: 1, // noise
      background: '#bbb', // background color
    });
    return captcha;
  }
}