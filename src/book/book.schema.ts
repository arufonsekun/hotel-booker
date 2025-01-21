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

  @Prop({ required: true, min: 1, max: 8, type: Number })
  capacity: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.pre('validate', (...rest) => {
  console.log('rest', rest);
});

export const BookModel = model<BookDocument>('Book', BookSchema);

export class CreateBookDto {
  @ApiProperty({
    description: 'Id do usuário que está fazendo a reserva',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Date de check-in (entrada no Hotel)',
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
    description: 'Quantidade de pessoas a serem acomodadas pela reserva',
    type: Number,
    required: true,
    example: 1,
    minimum: 1,
    maximum: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, {
    message: 'Pelo menos 1 pessoa deve ser acomodada',
  })
  @Max(8, {
    message: 'Um quarto pode acomodar no máximo 8 pessoas',
  })
  capacity: number;
}
