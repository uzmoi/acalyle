import { useStore } from "@nanostores/react";
import { bookStore } from "~/book/store";
import type { ID } from "~/lib/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import type { Book, BookId } from "./types";

export const useBook = (id: BookId): Book | null => {
  const store = bookStore(id as string as ID);
  const loader = useStore(store);
  return usePromiseLoader(loader) as Book | null;
};
