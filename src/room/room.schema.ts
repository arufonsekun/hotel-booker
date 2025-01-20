import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { HydratedDocument, model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;
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
      'Room description like: Quarto de hotel com vista para o mar e suíte master',
    type: String,
    required: false,
    example: 'Quarto com vista para o mar e suíte master',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Hotel room price per night',
    type: Number,
    required: true,
    example: 1500.95,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'How many people can stay in this room',
    type: Number,
    required: true,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
