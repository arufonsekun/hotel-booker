import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CreateUserDto, User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.userService.store(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async get(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
  }
}
