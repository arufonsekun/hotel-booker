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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<CreateRoomDto> {
    const data = createRoomDto;
    return this.roomService.store(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(): Promise<ListRoomDto[]> {
    return this.roomService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async get(@Param('id') id: string): Promise<ListRoomDto> {
    return this.roomService.findById(id);
  }
}
