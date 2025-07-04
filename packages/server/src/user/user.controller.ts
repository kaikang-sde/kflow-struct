import { Controller, Get, Post, Body } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) { }

  @Post()
  findAll(@Body() dto: FindUserDto) {
    return this.userService.findAll(dto);
  }
}
