import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto, User, UserModel } from './user.schema';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async store(userToCreate: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(userToCreate.password, 10);
    const user = new this.userModel({ ...userToCreate, password });
    return user.save();
  }

  async findOneByEmail(email: string): Promise<any | undefined> {
    return await UserModel.findOne({ email }).select('+password').exec();
  }

  async findOneById(id: string): Promise<User> {
    return await UserModel.findOne({
      _id: new Types.ObjectId(id),
    }).exec();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async spendCredit(userId: string, roomPrice: number): Promise<User> {
    return await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $inc: { credit: roomPrice * -1 } },
      { new: true },
    ).exec();
  }

  async earnCredit(userId: string, credit: number): Promise<User> {
    return await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $inc: { credit } },
      { new: true },
    ).exec();
  }
}
