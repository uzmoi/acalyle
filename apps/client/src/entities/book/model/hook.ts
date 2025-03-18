import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $bookByRef, type BookRef } from "./ref";
import { $book } from "./store";
import type { Book, BookId } from "./types";

export const useBookByRef = (ref: BookRef): Book => {
  const loader = useStore($bookByRef(ref));
  const book = usePromiseLoader(loader);

  if (book == null) {
    throw new Error(`Book (ref: ${ref}) not exists`);
  }

  return book;
};

export const useBook = (id: BookId): Book => {
  const loader = useStore($book(id));
  const book = usePromiseLoader(loader);

  if (book == null) {
    throw new Error(`Book (id: ${id}) not exists`);
  }

  return book;
};
