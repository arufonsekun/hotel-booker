import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto, ListUserDto, User } from './user.schema';
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
  async list(): Promise<ListUserDto[]> {
    return await this.userService.findAll();
  }
}
