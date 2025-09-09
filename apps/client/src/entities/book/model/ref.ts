import { fetchBook, fetchBookByHandle } from "../api";
import type { Book, BookHandle, BookId } from "./types";

export type BookRef = `_${BookId}` | BookHandle;

export const bookRefFromId = (bookId: BookId): BookRef => `_${bookId}`;

export const bookRefOf = (book: Book): BookRef => book.handle ?? `_${book.id}`;

export const fetchBookByRef = (ref: BookRef): Promise<Book | null> =>
  ref.startsWith("_") ?
    fetchBook(ref.slice(1) as BookId)
  : fetchBookByHandle(ref as BookHandle);
