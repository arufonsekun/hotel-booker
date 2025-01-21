import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './book.schema';
import { ApiOperation } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cliente, reserve seu quarto de hotel agora mesmo (basta apenas saber o id do quarto)',
  })
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    this.bookService.store(createBookDto);
  }
}
