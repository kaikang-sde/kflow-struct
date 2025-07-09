import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { GetUserHeader, GetUserIp } from 'src/common/decorators/request.utils';
import { CaptchaDto } from './dto/captcha.dto';
import { SecretTool } from 'src/utils/secret-tool';
import { RandomTool } from 'src/utils/random-tool';
import { TextCodeDto } from './dto/text-code.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordLoginDto, SmsLoginDto } from './dto/login.dto';
import { WechatCallbackRequest } from '@kflow-struct/share';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly secretTool: SecretTool,
    private readonly randomTool: RandomTool,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  @Post('captcha')
  getCaptcha(
    @Body() body: CaptchaDto,
    @GetUserIp() ip: string,
    @GetUserHeader('user-agent') userAgent: string
  ) {
    const { type } = body;
    // ip + device info
    const _key = this.secretTool.getSecret(ip + userAgent);

    return this.userService.getCaptcha(_key, type);
  }


  @Post('text-code')
  async getTextCode(
    @Body() body: TextCodeDto,
    @GetUserIp() ip: string,
    @GetUserHeader('user-agent') userAgent: string
  ) {
    const { phone, type, captcha } = body;
    // ip + device info
    const _key = this.secretTool.getSecret(ip + userAgent);
    const code = this.randomTool.randomCode();
    return await this.userService.getTextCode(_key, type, captcha, phone, code);
  }


  @Post('signup')
  async register(@Body() body: RegisterDto) {
    const { phone, textCode, password, confirmPassword } = body;
    return this.userService.register(phone, textCode, password, confirmPassword);
  }


  @Post('login/password')
  async passwordLogin(@Body() body: PasswordLoginDto) {
    const { phone, password } = body;
    return this.userService.passwordLogin(phone, password);
  }

  @Post('login/sms')
  async smsLogin(@Body() body: SmsLoginDto) {
    const { phone, textCode } = body;
    return this.userService.smsLogin(phone, textCode);
  }

  /** Wechat verification
   * @param params 
   * @returns 
   */
  @Get('login/wechat/callback')
  async wechatCallback(@Query() params: WechatCallbackRequest) {
    return this.userService.wechatCallback(params);
  }

  /** Retrive Wechat login QR code
   * @returns 
   */
  @Get('login/wechat')
  async wechatLogin() {
    return this.userService.wechatLogin();
  }


  /** Invoke when user scan QR code
   * @param body 
   * @returns 
   */
  @Post('login/wechat/callback')
  async wechatMessage(@Body()body) {
    return this.userService.wechatMessage(body);
  }

  /** Poll Wechat login status
   * @param body 
   * @returns 
   */
  @Get('login/wechat/poll')
  async wechatPoll(@Query() param:{ticket: string}) {
    return this.userService.wechatPoll(param);
  }
  









}

