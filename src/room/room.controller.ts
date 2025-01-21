import {
  Controller,
  HttpCode,
  Body,
  HttpStatus,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { CreateRoomDto, ListRoomDto } from './room.schema';
import { RoomService } from './room.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

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
    return this.roomService.findById(id);
  }
}
