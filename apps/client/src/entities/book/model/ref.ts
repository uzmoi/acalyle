import { $book } from "./store";
import type { Book, BookHandle, BookId } from "./types";

export type BookRef = `_${BookId}` | BookHandle;

export const bookRefFromId = (bookId: BookId): BookRef => `_${bookId}`;

export const bookRefOf = (book: Book): BookRef => book.handle ?? `_${book.id}`;

export const $bookByRef = (ref: BookRef) =>
  ref.startsWith("_") ?
    $book(ref.slice(1) as BookId)
  : $book.byHandle(ref as BookHandle);
