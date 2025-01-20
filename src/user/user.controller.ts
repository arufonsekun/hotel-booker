import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  UnprocessableEntityException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto, User, UpdateUserDto } from './user.schema';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new ConflictException('User email already exists');
    }
    return this.userService.store(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all users' })
  @Get()
  async list(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @ApiOperation({ summary: 'Get a user by id' })
  @Get(':id')
  async get(@Param('id') id: string): Promise<User> {
    const user = this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Updates user data, by now only credit field is supported',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnprocessableEntityException('User id not found');
    }

    return this.userService.update(id, updateUserDto);
  }
}
