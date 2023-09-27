import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { bookStore } from "~/store/book";

export const useBook = (bookId: Scalars["ID"]) => {
    const bookLoader = useStore(bookStore(bookId));
    return usePromiseLoader(bookLoader);
};
