import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto, ListUserDto, User, UserModel } from './user.schema';
import * as bcrypt from 'bcrypt';

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
    return await UserModel.findOne({ email }).exec();
  }

  // todo: ajustar pra retornar o user sem senha
  async findAll(): Promise<ListUserDto[]> {
    return await this.userModel.find().exec();
  }
}
