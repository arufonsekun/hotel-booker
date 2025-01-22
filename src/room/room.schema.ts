import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { addDays } from 'src/utils';
import { HydratedDocument, model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  _id: string;
  __v: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: false, default: null })
  bookerId: string;

  @Prop({ required: false, default: false })
  booked: boolean;

  @Prop({ required: false, default: null })
  paymentConfirmed: boolean;

  @Prop({ required: false, default: null })
  checkInAt: Date;

  @Prop({ required: false, default: null })
  checkOutAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

export const RoomModel = model<RoomDocument>('Room', RoomSchema);

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room name like: Quarto de hotel em Copacabana',
    type: String,
    required: true,
    example: 'Quarto no hotel Copacabana',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Descrição do quarto: Quarto de hotel com vista para o mar e suíte master',
    type: String,
    required: false,
    example: 'Quarto com vista para o mar e suíte master',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Valor da diária do quarto',
    type: Number,
    required: true,
    example: 1500.95,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Quantas pessoas podem se hospedar no quarto',
    type: Number,
    required: true,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}

export class ListRoomDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly capacity: number;
  readonly booked: boolean;
}

export class BookRoomRequestDto {
  @ApiProperty({
    description: 'Id do usuário que está fazendo a reserva',
    type: String,
    required: true,
    example: '678ef4516b8fb6c4fcaf5025',
  })
  @IsString()
  @IsNotEmpty()
  bookerId: string;

  @ApiProperty({
    description: 'Data de check-in (entrada no Hotel)',
    type: Date,
    required: true,
    example: addDays(new Date(), 2),
  })
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(addDays(new Date(), 2), {
    message: 'Data de check-in deve ser pelo menos dois dias depois de hoje',
  })
  checkInAt: Date;

  @ApiProperty({
    description: 'Data de check-out (saída do Hotel)',
    type: Date,
    required: true,
    example: addDays(new Date(), 3),
  })
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(addDays(new Date(), 3), {
    message: 'Data de check-out deve ser depois da data de check-it',
  })
  checkOutAt: Date;

  @ApiProperty({
    description:
      'Quantidade de pessoas que irão se hospedar no quarto (incluindo você)',
    type: Number,
    minimum: 1,
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  companionsAmount: number;
}

export class BookRoomResponseDto {
  room: Room;
  message: string;
}

export class RoomBookPaymentRequestDto {
  @ApiProperty({
    description: 'Id do usuário que está fazendo a reserva',
    type: String,
    required: true,
    example: '678ef4516b8fb6c4fcaf5025',
  })
  @IsString()
  @IsNotEmpty()
  bookerId: string;
}
export class RoomBookPaymentResponseDto extends BookRoomResponseDto {}

export class RoomCheckInRequestDto {
  @ApiProperty({
    description: 'Id do usuário que fez a reserva do quarto',
    type: String,
    required: true,
    example: '678ef4516b8fb6c4fcaf5025',
  })
  @IsString()
  @IsNotEmpty()
  bookerId: string;
}
export class RoomCheckInResponseDto extends BookRoomResponseDto {}

export class RoomCheckOutRequestDto extends RoomCheckInRequestDto {}
export class RoomCheckoutResponseDto extends RoomCheckInResponseDto {}

export class RoomBookingDownloadRequestDto extends RoomCheckInRequestDto {}
