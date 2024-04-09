import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import { bookStore } from "~/book/store";
import { usePromiseLoader } from "~/lib/promise-loader";

export const useBook = (bookId: ID) => {
    const bookLoader = useStore(bookStore(bookId));
    return usePromiseLoader(bookLoader);
};
