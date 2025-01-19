import { Connection } from 'mongoose';
import { Book, BookSchema } from './book.schema';

export const bookProviders = [
  {
    provide: 'BOOK_MODEL',
    inject: ['DATABASE_CONNECTION'],
    useFactory: (connection: Connection) => connection.model(Book.name, BookSchema),
  },
];
