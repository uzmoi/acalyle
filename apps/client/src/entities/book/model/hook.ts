import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $book } from "./store";
import type { Book, BookId } from "./types";

export const useBook = (id: BookId): Book | null => {
  const loader = useStore($book(id));
  return usePromiseLoader(loader);
};
