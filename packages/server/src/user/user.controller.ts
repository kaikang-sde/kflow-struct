import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  @Get()
  findAll() {
    return this.userRepository.find();
  }
}
