import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Book, CreateBookDto } from './book.schema';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_MODEL')
    private bookModel: Model<Book>,
  ) {}

  async store(createBookDto: CreateBookDto): Promise<Book> {
    const book = new this.bookModel(createBookDto);
    console.log('book', book);
    return book.save();
  }
}
