import {
  Controller,
  HttpCode,
  Body,
  HttpStatus,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { CreateRoomDto } from './room.schema';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    const data = createRoomDto;
    return this.roomService.store(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async list() {
    return this.roomService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.roomService.findById(id);
  }
}
