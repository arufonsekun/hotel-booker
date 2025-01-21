import { Injectable, Inject } from '@nestjs/common';
import { CreateRoomDto, ListRoomDto, Room } from './room.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoomService {
  constructor(
    @Inject('ROOM_MODEL')
    private roomModel: Model<Room>,
  ) {}

  async store(createRoomDto: CreateRoomDto): Promise<CreateRoomDto> {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(): Promise<ListRoomDto[]> {
    return await this.roomModel.find().exec();
  }

  async findById(id: string): Promise<Room> {
    return await this.roomModel.findOne({ _id: new ObjectId(id) }).exec();
  }

  async book(room: Room): Promise<Room> {
    const roomDocumentVersion = room.__v;
    const roomId = room._id;

    const bookedRoom = await this.roomModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(roomId),
          __v: roomDocumentVersion,
        },
        { $set: { booked: true, __v: roomDocumentVersion + 1 } },
        { new: true },
      )
      .exec();
    return bookedRoom;
  }
}
