import {
  Controller,
  HttpCode,
  Body,
  HttpStatus,
  Post,
  Get,
  Param,
  UploadedFile,
  NotFoundException,
  UnprocessableEntityException,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import {
  CreateRoomDto,
  ListRoomDto,
  BookRoomRequestDto,
  BookRoomResponseDto,
  RoomCheckInRequestDto,
  RoomCheckInResponseDto,
  RoomBookPaymentRequestDto,
  RoomBookPaymentResponseDto,
  RoomCheckOutRequestDto,
  RoomCheckoutResponseDto,
  RoomBookingDownloadRequestDto,
} from './room.schema';
import { RoomService } from './room.service';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { uploadPaymentProofMulterOptions } from 'src/config/multer.config';
import * as fs from 'fs';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Hoteleiro, divulgue aqui seu quarto de hotel',
  })
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<CreateRoomDto> {
    const data = createRoomDto;
    return this.roomService.store(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Cliente, veja aqui uma lista de quartos de Hotel que você pode reservar agora (ou quando estiverem livres)',
  })
  @Get()
  async list(): Promise<ListRoomDto[]> {
    return this.roomService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Veja aqui as informações de um quarto de hotel específico',
  })
  @Get(':id')
  async get(@Param('id') id: string): Promise<ListRoomDto> {
    const room = this.roomService.findById(id);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }
    return room;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Cliente, reserve seu quarto de hotel agora mesmo (basta informar o id do quarto desejado, data de entrada e saída)',
  })
  @Post(':id/book')
  async book(
    @Param('id') roomId: string,
    @Body() bookRoomDto: BookRoomRequestDto,
  ): Promise<BookRoomResponseDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const room = await this.roomService.findById(roomId);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }

    const roomHoldsAllPeople = room.capacity >= bookRoomDto.companionsAmount;
    if (!roomHoldsAllPeople) {
      throw new UnprocessableEntityException(
        `Infelizmente o quarto não acomoda todos os seus acompanhantes, capacidade máxima: ${room.capacity}`,
      );
    }

    const updatedRoom = await this.roomService.book(
      room,
      user,
      bookRoomDto.checkInAt,
      bookRoomDto.checkOutAt,
    );
    if (!updatedRoom) {
      throw new UnprocessableEntityException(
        'Quarto já reservado, por favor tente escolher outro quarto ou aguarde alguns dias até o quarto estar disponível novamente',
      );
    }

    return {
      room: updatedRoom,
      message:
        'Reserva realizada com sucesso, agora basta você enviar o comprovante do seu pagamento',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/payment')
  @ApiOperation({
    summary: 'Cliente, anexe aqui seu comprovante de pagamento da sua reserva',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Anexe aqui seu comprovante de pagamento (imagem ou PDF)',
    schema: {
      type: 'object',
      properties: {
        proofOfPayment: {
          type: 'string',
          format: 'binary',
        },
        bookerId: {
          type: 'string',
          description: 'Id do usuário que está fazendo a reserva',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('proofOfPayment', uploadPaymentProofMulterOptions),
  )
  async payment(
    @Param('id') roomId: string,
    @UploadedFile() proofOfPayment: Express.Multer.File,
    @Body() bookRoomDto: RoomBookPaymentRequestDto,
  ): Promise<RoomBookPaymentResponseDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!proofOfPayment) {
      throw new UnprocessableEntityException(
        'Comprovante de pagamento deve ser no formato de imagem ou PDF',
      );
    }

    const room = await this.roomService.findRoomBookedByUserWithPendingPayment(
      roomId,
      user,
    );

    if (!room) {
      throw new UnprocessableEntityException(
        'Esse quarto não está reservado em seu nome ou o pagamento da reserva já foi confirmado',
      );
    }

    const updatedRoom = await this.roomService.confirmPayment(room, user);
    if (!updatedRoom) {
      throw new UnprocessableEntityException(
        'Pagamento já foi confirmado ou quarto não reservado em seu nome',
      );
    }

    this.userService.earnCredit(bookRoomDto.bookerId, updatedRoom.price);

    this.roomService.storeRoomBookingPaymentProof(updatedRoom, user);

    return {
      room: updatedRoom,
      message:
        'Pagamento confirmado com sucesso, você já pode fazer o check-in no seu quarto. Acesse /book/download para ver seu comprovante',
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cliente, faça seu check-in aqui',
  })
  @Post(':id/checkin')
  async checkin(
    @Param('id') roomId: string,
    @Body() bookRoomDto: RoomCheckInRequestDto,
  ): Promise<RoomCheckInResponseDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException(
        'Usuário que fez a reserva não foi encontrado',
      );
    }

    const room =
      await this.roomService.findRoomBookedByUserWithPaymentConfirmed(
        roomId,
        user._id,
      );

    if (!room) {
      throw new UnprocessableEntityException(
        'Verifique se o quarto informado foi reservado por você e se seu pagamento foi confirmado',
      );
    }

    this.userService.spendCredit(bookRoomDto.bookerId, room.price);

    return {
      room,
      message: 'Check-in realizado com sucesso',
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cliente, faça checkout do seu quarto de hotel aqui',
  })
  @Post(':id/checkout')
  async checkout(
    @Param('id') roomId: string,
    @Body() bookRoomDto: RoomCheckOutRequestDto,
  ): Promise<RoomCheckoutResponseDto> {
    const user = await this.userService.findOneById(bookRoomDto.bookerId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const room = await this.roomService.findById(roomId);
    if (!room) {
      throw new NotFoundException('Quarto não encontrado');
    }

    const updatedRoom = await this.roomService.checkout(room, user);
    if (!updatedRoom) {
      throw new UnprocessableEntityException(
        'O quarto não está reservado para você',
      );
    }

    return {
      room: updatedRoom,
      message: 'Check-out realizado com sucesso',
    };
  }

  @ApiOperation({
    summary: 'Cliente, faça o download do comprovante da sua reserva',
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/book/download')
  async download(
    @Res() res: Response,
    @Param('id') roomId: string,
    @Body() roomBookingDownload: RoomBookingDownloadRequestDto,
  ): Promise<void> {
    const user = await this.userService.findOneById(
      roomBookingDownload.bookerId,
    );
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const room =
      await this.roomService.findRoomBookedByUserWithPaymentConfirmed(
        roomId,
        user._id,
      );
    if (!room) {
      throw new NotFoundException(
        'Você não reservou o quarto informado ou ainda não fez o pagamento',
      );
    }

    const filename = `${roomId}@${user._id}.pdf`;
    const filePath = `./proofs/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Comprovante não encontrado');
    }

    const clientFilename = `Comprovante de reserva do quarto - ${room.name} (${user.name}).pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${clientFilename}`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Erro ao stremar arquivo, erro: ${err.message}`);
    });
  }
}
