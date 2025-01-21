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
    description: 'Nome de pessoa física',
    type: String,
    required: true,
    example: 'Fulaninho Maneiro',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
    required: true,
    example: 'fulaninho.maneiro@firma.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description:
      'Quantidade de crédito que o usuário tem para gastar no Hotel Booker App',
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
    description: 'Email do usuário',
    type: String,
    required: true,
    example: 'fulaninho.maneiro@firma.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description:
      'Quantidade de crédito que o usuário irá adicionar à sua conta no Hotel Booker App',
    type: Number,
    required: true,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  credit: number;
}
