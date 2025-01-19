import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, Max, Min, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { HydratedDocument, model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { addDays } from 'src/utils';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true, type: Number })
  userId: number;

  @Prop({ required: true, type: Date })
  checkInAt: Date;

  @Prop({
    required: true,
    type: Date,
    message: 'Check-out date must be after check-in date',
  })
  checkOutAt: Date;

  @Prop({ required: true, min: 1, max: 3, type: Number })
  roomsAmount: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.pre('validate', (...rest) => {
  console.log('rest', rest);
});

export const BookModel = model<BookDocument>('Book', BookSchema);

export class CreateBookDto {
  @ApiProperty({
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Check-in date',
    type: Date,
    required: true,
    example: addDays(new Date(), 2),
  })
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(addDays(new Date(), 2), {
    message: 'Check-in date must be at least 2 days from today',
  })
  checkInAt: Date;

  @ApiProperty({
    description: 'Check-out date',
    type: Date,
    required: true,
    example: addDays(new Date(), 3),
  })
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(addDays(new Date(), 3), {
    message: 'Check-out date must be after check-in date',
  })
  checkOutAt: Date;

  @ApiProperty({
    description: 'Number of rooms to book',
    type: Number,
    required: true,
    example: 1,
    minimum: 1,
    maximum: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, {
    message: 'You must book at least 1 room',
  })
  @Max(3, {
    message: 'You can book up to 3 rooms',
  })
  roomsAmount: number;
}
