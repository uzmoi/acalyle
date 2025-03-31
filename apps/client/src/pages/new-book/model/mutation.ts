import { $book, type BookRef, bookRefFromId } from "~/entities/book";
import { createBookMutation } from "../api";

export const createBook = async (
  title: string,
  description: string,
): Promise<BookRef> => {
  const book = await createBookMutation(title, description);

  $book(book.id).resolve(book);

  return bookRefFromId(book.id);
};
