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
import {
  CreateUserDto,
  User,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './user.schema';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Faça seu cadastro aqui' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new ConflictException('O email informado já está em uso');
    }
    return this.userService.store(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Veja uma lista com todos os usuários' })
  @Get()
  async list(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @ApiOperation({
    summary: 'Veja as informações de um usuário em específico',
  })
  @Get(':id')
  async get(@Param('id') id: string): Promise<User> {
    const user = this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Cliente, adicione crédito à sua conta para poder reservar um quarto de hotel',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnprocessableEntityException('Id de usuário não encontrado');
    }

    const updatedUser = await this.userService.earnCredit(
      id,
      updateUserDto.credit,
    );
    return {
      user: updatedUser,
      message:
        'Apagamento realizado com sucesso, agora anexe o comprovante para que possamos confirmar sua reserva',
    };
  }
}
