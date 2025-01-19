import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { HydratedDocument, model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = model<UserDocument>('User', UserSchema);

export class CreateUserDto {
  @ApiProperty({
    description: 'User name like: Fulaninho',
    type: String,
    required: true,
    example: 'Fulaninho Maneiro',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'User email',
    type: String,
    required: true,
    example: 'fulaninho.maneiro@firma.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  password: string;
}

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
