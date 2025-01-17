import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.userService.store(createUserDto);
  }
}
