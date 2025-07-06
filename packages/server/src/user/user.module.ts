import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaptchaTool } from 'src/utils/captcha-tool';
import { SecretTool } from 'src/utils/secret-tool';
import { TextMessageTool } from 'src/utils/text-message-tool';
import { RandomTool } from 'src/utils/random-tool';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CaptchaTool, SecretTool, TextMessageTool, RandomTool],
})
export class UserModule {}
