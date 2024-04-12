import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import { bookStore } from "~/book/store";
import { bookHandleStore, handleBookStore } from "~/book/store/book";
import { usePromiseLoader } from "~/lib/promise-loader";

/** @deprecated */
export const useBookId = (bookHandle: string) => {
    return (
        usePromiseLoader(
            useStore(
                bookHandleStore(
                    bookHandle.startsWith("@") ? bookHandle.slice(1) : "",
                ),
            ),
        ) ?? (bookHandle as ID)
    );
};

/** @deprecated */
export const useBook = (bookHandle: string) => {
    return usePromiseLoader(
        useStore(
            bookHandle.startsWith("@") ?
                handleBookStore(bookHandle.slice(1))
            :   bookStore(bookHandle as ID),
        ),
    );
};
