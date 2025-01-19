import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    console.log('book create', createBookDto);
    this.bookService.store(createBookDto);
  }
}
