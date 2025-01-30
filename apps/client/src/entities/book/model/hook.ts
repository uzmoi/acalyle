import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $bookByRef, type BookRef } from "./ref";
import { $book } from "./store";
import type { Book, BookId } from "./types";

export const useBookByRef = (ref: BookRef): Book | null => {
  const loader = useStore($bookByRef(ref));
  return usePromiseLoader(loader);
};

export const useBook = (id: BookId): Book | null => {
  const loader = useStore($book(id));
  return usePromiseLoader(loader);
};
