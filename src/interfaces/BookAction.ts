import Book from '@/interfaces/Book';

export default interface BookAction {
  title: string;
  action: (book: Book) => any;
  disableBook: boolean;
}
