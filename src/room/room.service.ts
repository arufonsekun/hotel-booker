import { Injectable, Inject } from '@nestjs/common';
import { CreateRoomDto, Room } from './room.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoomService {
  constructor(
    @Inject('ROOM_MODEL')
    private roomModel: Model<Room>,
  ) {}

  async store(createRoomDto: CreateRoomDto) {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(): Promise<Room[]> {
    return await this.roomModel.find().exec();
  }

  async findById(id: string): Promise<Room[]> {
    return await this.roomModel.find({ _id: new ObjectId(id) }).exec();
  }
}
