import { Injectable, Inject } from '@nestjs/common';
import { CreateRoomDto, ListRoomDto, Room } from './room.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from 'src/user/user.schema';

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

  async checkin(room: Room, user: User): Promise<Room> {
    const roomDocumentVersion = room.__v;
    const roomId = room._id;

    const bookedRoom = await this.roomModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(roomId),
          __v: roomDocumentVersion,
          booked: false,
          bookerId: null,
        },
        {
          $set: {
            booked: true,
            __v: roomDocumentVersion + 1,
            bookerId: new ObjectId(user.id),
          },
        },
        { new: true },
      )
      .exec();
    return bookedRoom;
  }

  async checkout(room: Room, user: User): Promise<Room> {
    return await this.roomModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(room._id),
          booked: true,
          bookerId: new ObjectId(user.id),
        },
        { $set: { booked: false, bookerId: null } },
        { new: true },
      )
      .exec();
  }
}
