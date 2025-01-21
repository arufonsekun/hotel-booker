import {
  Controller,
  HttpCode,
  Body,
  HttpStatus,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { CreateRoomDto, ListRoomDto, BookRoomDto } from './room.schema';
import { RoomService } from './room.service';
import { UserService } from 'src/user/user.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Hoteleiro, divulgue aqui seu quarto de hotel',
  })
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<CreateRoomDto> {
    const data = createRoomDto;
    return this.roomService.store(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Cliente, veja aqui uma lista de quartos de Hotel que você pode reservar',
  })
  @Get()
  async list(): Promise<ListRoomDto[]> {
    return this.roomService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Veja aqui as informações de um quarto de hotel específico',
  })
  @Get(':id')
  async get(@Param('id') id: string): Promise<ListRoomDto> {
    const room = this.roomService.findById(id);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }
    return room;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Cliente, reserve seu quarto de hotel agora mesmo (basta informar o id do quarto desejado)',
  })
  @Post(':id/checkin')
  async book(
    @Param('id') roomId: string,
    @Body() bookRoomDto: BookRoomDto,
  ): Promise<ListRoomDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const room = await this.roomService.findById(roomId);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }

    const userHasEnoughtCredit = user.credit >= room.price;
    if (!userHasEnoughtCredit) {
      throw new UnprocessableEntityException(
        'Você não tem crédito suficiente para fazer a reserva',
      );
    }

    const updatedRoom = await this.roomService.checkin(room, user);
    if (!updatedRoom) {
      throw new UnprocessableEntityException(
        'Quarto já reservado, por favor tente escolher outro quarto',
      );
    }

    /**
     * Update user credit after booking the room
     */
    this.userService.update(bookRoomDto.bookerId, {
      credit: updatedRoom.price * -1,
    });

    return updatedRoom;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cliente, faça checkout do seu quarto de hotel',
  })
  @Post(':id/checkout')
  async checkout(
    @Param('id') roomId: string,
    @Body() bookRoomDto: BookRoomDto,
  ): Promise<ListRoomDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const room = await this.roomService.findById(roomId);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }

    const updatedRoom = await this.roomService.checkout(room, user);
    if (!updatedRoom) {
      throw new UnprocessableEntityException(
        'O quarto não está reservado para você',
      );
    }

    return updatedRoom;
  }
}
