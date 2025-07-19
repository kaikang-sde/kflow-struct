import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaptchaTool } from 'src/utils/captcha-tool';
import { SecretTool } from 'src/utils/secret-tool';
import { TextMessageTool } from 'src/utils/text-message-tool';
import { RandomTool } from 'src/utils/random-tool';
import { WechatLoginToolModule } from 'src/modules/wechat/wechat-login.module';
import { wechatLoginConfig } from 'config';
import { WechatDataTool } from 'src/utils/wechat-data-tool';


@Module({
  imports: [
    WechatLoginToolModule.forRoot(wechatLoginConfig),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService, CaptchaTool, SecretTool, TextMessageTool, RandomTool, WechatDataTool],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
