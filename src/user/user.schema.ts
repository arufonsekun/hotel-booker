import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { HydratedDocument, model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: false, default: 0, min: 0 })
  credit: number;
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
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'User email',
    type: String,
    required: true,
    example: 'fulaninho.maneiro@firma.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description:
      'Amount of credit the user has to spent in the Hotel Booker app',
    type: Number,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  credit: number;
}

export class SignInUserDto {
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

export class UpdateUserDto {
  @ApiProperty({
    description:
      'Amount of credit the user will add to his account in the Hotel Booker App',
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  credit: number;
}
