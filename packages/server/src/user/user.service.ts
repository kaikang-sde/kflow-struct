import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisModule } from 'src/modules/redis/redis.module';
import { CaptchaTool } from 'src/utils/captcha-tool';
import * as dayjs from 'dayjs';
import { TextMessageTool } from 'src/utils/text-message-tool';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RandomTool } from 'src/utils/random-tool';
import { SecretTool } from 'src/utils/secret-tool';
import { JwtService } from '@nestjs/jwt';
import { WechatCallbackRequest } from '@kflow-struct/share';
import { WechatLoginToolModule } from 'src/modules/wechat/wechat-login.module';
import { createHash } from 'node:crypto'
import { WechatDataTool } from 'src/utils/wechat-data-tool';


@Injectable()
export class UserService {
  constructor(
    private readonly redisModule: RedisModule,
    private readonly captchaTool: CaptchaTool,
    private readonly textMessageTool: TextMessageTool,
    private readonly randomTool: RandomTool,
    private readonly secretTool: SecretTool,
    private readonly jwtService: JwtService,
    private readonly wechatDataTool: WechatDataTool,
    private readonly wechatLoginToolModule: WechatLoginToolModule,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  /** Captcha Service
   * @param _key Redis key
   * @param type captcha type
   * @returns captcha
   */
  async getCaptcha(_key: string, type: string) {
    const svgCaptcha = await this.captchaTool.captche();
    this.redisModule.set(`${type}:captcha:${_key}`, svgCaptcha.text, 60);
    return {
      captcha: svgCaptcha.data,
      text: svgCaptcha.text
    }
  }

  /** Text Code Service
   * @param _key 
   * @param type 
   * @param captcha 
   * @param phone 
   * @param code 
   * @returns 
   */
  async getSmsCode(_key: string, type: string, captcha: string, phone: string, code: number) {
    // Text Code cannot be resend within 60s 
    if (await this.redisModule.exists(`${type}:code:${phone}`)) {
      const dateRedis = dayjs(
        // get data, split, get first item, convert to number, convert to dayjs
        Number((await this.redisModule.get(`${type}:code:${phone}`))!.split('_')[0]),
      )
      const dateNow = dayjs();
      if (dateNow.diff(dateRedis, 'second') <= 60) {
        throw new BadRequestException('Text code cannot be resend within 60s!');
      }
    }

    // check captcha
    if (!(await this.redisModule.exists(`${type}:captcha:${_key}`)))
      throw new BadRequestException('Please get captcha first!');

    // check user passed captcha and redis captcha are the same
    const captchaRedis = await this.redisModule.get(`${type}:captcha:${_key}`);
    if (captchaRedis !== String(captcha))
      throw new BadRequestException('Captcha is incorrect!');

    // send text code
    const textCode = await this.textMessageTool.sendMsgCode(phone, code);

    // delete captcha
    this.redisModule.del(`${type}:captcha:${_key}`);

    // set text code in redis 
    this.redisModule.set(`${type}:code:${phone}`, `${Date.now()}_${code}`, 60);

    // if text code is sent successfully, return null, else delete code in redis and throw error
    if (textCode.code === 0) {
      return null;
    } else {
      this.redisModule.del(`${type}:code:${phone}`);
      throw new BadRequestException(textCode.msg);
    }
  }


  /** Register Service
   * @param phone 
   * @param textCode 
   * @param password 
   * @param confirmPassword 
   * @returns 
   */
  async register(phone: string, smsCode: string, password: string, confirmPassword: string) {
    // check user exists, phone cannot be registered
    if (await this.userRepository.findOneBy({ phone })) {
      throw new BadRequestException('Phone has been registered!');
    }

    // check user passed text code and redis text code are the same
    if (await this.redisModule.get(`register:code:${phone}`)) {
      const codeRes = (await this.redisModule.get(`register:code:${phone}`))!.split('_')[1];
      if (codeRes !== smsCode)
        throw new BadRequestException('SMS code is incorrect!');
    } else {
      throw new BadRequestException('Please get SMS code first!');
    }

    // check password
    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match!');

    // randome avatar and name
    const userAvatar = this.randomTool.randomAvatar();
    const userName = this.randomTool.randomName();

    // hash password
    const hashPassword = this.secretTool.getSecret(password);

    // create user/ insert to database
    const user = await this.userRepository.save({
      username: userName,
      avatar: userAvatar,
      phone,
      password: hashPassword,
      open_id: '',
    });

    // token - 7 days, after user register, directly login
    const token = this.jwtService.sign({ id: user.id });

    // delete text code
    this.redisModule.del(`register:code:${phone}`);

    return { data: token, msg: 'Register successfully!' };
  }

  /** Password Login
   * @param phone 
   * @param password 
   */
  async passwordLogin(phone: string, password: string) {
    // check user exists
    const user = await this.userRepository.findOneBy({ phone });
    if (!user) throw new BadRequestException('User not found!');

    // check password
    if (user.password !== this.secretTool.getSecret(password))
      throw new BadRequestException('Password is incorrect!');

    return {
      data: this.jwtService.sign({ id: user.id }), // generate token and return token
      msg: 'Login successfully!'
    };
  }

  /** SMS Login
   * @param phone 
   * @param smsCode 
   */
  async smsLogin(phone: string, smsCode: string) {
    // check user exists
    const user = await this.userRepository.findOneBy({ phone });
    if (!user) throw new BadRequestException('User not found!');

    // check text code
    const codeRes = (await this.redisModule.get(`login:code:${phone}`));
    if (!codeRes) throw new BadRequestException('Please get SMS code first!');

    // check user passed text code and redis text code are the same
    const code = (await this.redisModule.get(`login:code:${phone}`))!.split('_')[1];
    if (code !== smsCode)
      throw new BadRequestException('SMS code is incorrect!');

    // delete text code
    this.redisModule.del(`login:code:${phone}`);

    return {
      data: this.jwtService.sign({ id: user.id }),
      msg: 'Login successfully!'
    };
  }

  /** Wechat Service Verfication 
   * @param params 
   * @returns 
   */
  async wechatCallback(params: WechatCallbackRequest) {
    const { signature, timestamp, nonce, echostr } = params;

    // wechat token
    const token = this.wechatLoginToolModule.token;

    // based on wechat doc
    const str = [token, timestamp, nonce].sort().join('')
    const hash = createHash('sha1')
    hash.update(str)
    const encryptedData = hash.digest('hex')

    if (encryptedData === signature) {

      return {
        data: echostr,
        msg: 'wechat callback success'
      }
    }
  }

  /** Wechat QR code retrieval
   * @returns 
   */
  async wechatLogin() {
    // get QR code
    const { qrCodeUrl, ticket } = await this.wechatLoginToolModule.getQRCode();
    const redisKey = `wechat:ticket:${ticket}`;
    this.redisModule.set(redisKey, JSON.stringify({ isScan: 'no' }), 120);
    return { qrCodeUrl, ticket };
  }


  /** Accept Wechat callback
   * @param body 
   * body example：{'<xml><Ticket>gQGc7jwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAybUhCUVUwOGllNmoxbnNkSXhFMXAAAgRkTWxoAwR4AAAA</Ticket><CreateTime>1751928185</CreateTime><EventKey>123</EventKey><Event>SCAN</Event><ToUserName>gh_bb8539d444db</ToUserName><FromUserName>oiNKG09Op5an8lfgfDxgAJuwoNes</FromUserName><MsgType>event</MsgType></xml>': ''}
   * @returns 
   */
  async wechatMessage(body: any) {
    interface IObjectData {
      xml: object
    }
    const xmlData = Object.keys(body)[0];  // '<xml><Ticket>gQGc7jwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAybUhCUVUwOGllNmoxbnNkSXhFMXAAAgRkTWxoAwR4AAAA</Ticket><CreateTime>1751928185</CreateTime><EventKey>123</EventKey><Event>SCAN</Event><ToUserName>gh_bb8539d444db</ToUserName><FromUserName>oiNKG09Op5an8lfgfDxgAJuwoNes</FromUserName><MsgType>event</MsgType></xml>'
    const objData = await this.wechatDataTool.getObject(xmlData) as IObjectData; // convert xml to object but it has multiple layers and arrays
    const loginData = this.wechatDataTool.convertToNormalObject(objData.xml); // convert to normal object that has only one layer with string value

    // based on open_id to check if user registered
    const openIdRes = await this.userRepository.findOneBy({ open_id: loginData.FromUserName });

    // randome avatar and name
    const userAvatar = this.randomTool.randomAvatar();
    const userName = this.randomTool.randomName();
    let userId: number | null = null;

    if (openIdRes) {
      // user exists
      userId = openIdRes.id;
    } else {
      // user not exists
      const newUser = await this.userRepository.save({
        username: userName,
        avatar: userAvatar,
        open_id: loginData.FromUserName,
        phone: '',
        password: ''
      });
      userId = newUser.id;
    }
    // token
    const token = this.jwtService.sign({ id: userId });

    // Redis
    const redisKey = `wechat:ticket:${loginData.Ticket}`;
    const existsKey = await this.redisModule.exists(redisKey);
    if (existsKey) this.redisModule.set(redisKey, JSON.stringify({ isScan: 'yes', token }), 120);

    // return wechat service content
    let content = ''
    if (loginData.MsgType === 'event') {
      if (loginData.Event === 'SCAN')
        content = 'Welcome back: kflow-struct service!'
      else if (loginData.Event === 'subscribe')
        content = 'Welcome to kflow-struct service!'

      const msgStr = `<xml>
      <ToUserName><![CDATA[${loginData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${loginData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
     </xml>`


      return {
        data: msgStr,
        msg: 'Login successfully!'
      };
    }
  }


  /** Poll Wechat login status
   * @param param 
   * @returns 
   */
  async wechatPoll(param: { ticket: string }) {
    const { ticket } = param;
    const redisKey = `wechat:ticket:${ticket}`;
    const redisData = JSON.parse((await this.redisModule.get(redisKey)) as string);
    if (redisData && redisData.isScan === 'yes') {
      const { token } = redisData;
      return { 
        data: token, 
        msg: 'Login successfully!' 
      };
    }
    return {
      msg: 'Please scan QR code first!'
    }
  }
}
