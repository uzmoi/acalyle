import { $book } from "./store";
import type { Book, BookHandle, BookId } from "./types";

export type BookRef = BookId | BookHandle;

export const bookRefOf = (book: Book): BookRef =>
  book.handle ? (`@${book.handle}` as BookHandle) : book.id;

export const $bookByRef = (ref: BookRef) =>
  ref.startsWith("@") ?
    $book.byHandle(ref.slice(1) as BookHandle)
  : $book(ref as BookId);
