import { Injectable, Inject } from '@nestjs/common';
import { CreateRoomDto, ListRoomDto, Room } from './room.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from 'src/user/user.schema';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

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

  async findRoomBookedByUserWithPendingPayment(roomId: string, user: User) {
    const roomBookedByUserWithPendingPayment = {
      _id: new ObjectId(roomId),
      booked: true,
      bookerId: new ObjectId(user._id),
      paymentConfirmed: false,
    };

    return await this.roomModel
      .findOne(roomBookedByUserWithPendingPayment)
      .exec();
  }

  async findRoomBookedByUserWithPaymentConfirmed(
    roomId: string,
    userId: string,
  ): Promise<Room> {
    const roomBookedByUserWithPaymentConfirmed = {
      _id: new ObjectId(roomId),
      booked: true,
      bookerId: new ObjectId(userId),
      paymentConfirmed: true,
    };

    return await this.roomModel
      .findOne(roomBookedByUserWithPaymentConfirmed)
      .exec();
  }

  /**
   * Método que implementa a reserva de um quarto de hotel utilizando
   * da estratégia: Optimistic Locking. Nele o quarto que se deseja
   * reservar é atualizado com base no id e na versão do documento.
   * Se a transação retornar um documento significa que a versão
   * que tenho em mãos é a mais atual e que ninguém além de mim
   * reservou o quarto, caso contrário o quarto foi reservado
   * por outrém e eu não poderei reservá-lo.
   *
   * @param room quarto a ser reservado
   * @param user cliente que está rservando o quarto
   * @returns quarto reservado
   */
  async book(
    room: Room,
    user: User,
    checkInAt: Date,
    checkOutAt: Date,
  ): Promise<Room> {
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
            paymentConfirmed: false,
            __v: roomDocumentVersion + 1,
            bookerId: new ObjectId(user._id),
            checkInAt,
            checkOutAt,
          },
        },
        { new: true },
      )
      .exec();
    return bookedRoom;
  }

  async confirmPayment(room: Room, user: User): Promise<Room> {
    const roomBookedByUserWithPendingPayment = {
      _id: new ObjectId(room._id),
      booked: true,
      bookerId: new ObjectId(user._id),
      paymentConfirmed: false,
    };
    return await this.roomModel
      .findOneAndUpdate(
        roomBookedByUserWithPendingPayment,
        { $set: { paymentConfirmed: true } },
        { new: true },
      )
      .exec();
  }

  async checkout(room: Room, user: User): Promise<Room> {
    const roomBookedByUserWithPaymentConfirmed = {
      _id: new ObjectId(room._id),
      booked: true,
      bookerId: new ObjectId(user._id),
      paymentConfirmed: true,
    };

    return await this.roomModel
      .findOneAndUpdate(
        roomBookedByUserWithPaymentConfirmed,
        {
          $set: {
            booked: false,
            bookerId: null,
            paymentConfirmed: null,
            checkInAt: null,
            checkOutAt: null,
          },
        },
        { new: true },
      )
      .exec();
  }

  async storeRoomBookingPaymentProof(room: Room, user: User): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pdfContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #4CAF50; }
          p { font-size: 16px; }
          ul { margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1> Informações da reserva do quarto: ${room.name}</h1>
        <p><strong>Nome:</strong> ${user.name}</p>
        <p><strong>Entrada:</strong> ${room.checkInAt.toLocaleString()}</p>
        <p><strong>Saída:</strong>${room.checkOutAt.toLocaleString()}</p>
        <p> Pagamento confirmado ✅ </p>
      </body>
      </html>
    `;

    await page.setContent(pdfContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    const filePath = `./proofs/${room._id}@${user._id}.pdf`;
    fs.writeFileSync(filePath, pdfBuffer);

    return filePath;
  }
}
