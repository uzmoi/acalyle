import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $book } from "./store";
import type { Book, BookHandle, BookId, BookRef } from "./types";

export const useBookByRef = (bookRef: BookRef): Book | null => {
  const store =
    bookRef.startsWith("@") ?
      $book.byHandle(bookRef.slice(1) as BookHandle)
    : $book(bookRef as BookId);

  const loader = useStore(store);
  return usePromiseLoader(loader);
};

export const useBook = (id: BookId): Book | null => {
  const loader = useStore($book(id));
  return usePromiseLoader(loader);
};
