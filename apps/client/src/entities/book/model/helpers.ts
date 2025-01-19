import type { Book, BookHandle, BookRef } from "./types";

export const bookRefOf = (book: Book): BookRef =>
  book.handle ? (`@${book.handle}` as BookHandle) : book.id;
