import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { bookHandleStore, bookStore, handleBookStore } from "~/store/book";

export const useBookId = (bookHandle: string) => {
    return (
        usePromiseLoader(
            useStore(
                bookHandleStore(
                    bookHandle.startsWith("@") ? bookHandle.slice(1) : "",
                ),
            ),
        ) ?? bookHandle
    );
};

export const useBook = (bookHandle: string) => {
    return usePromiseLoader(
        useStore(
            bookHandle.startsWith("@")
                ? handleBookStore(bookHandle.slice(1))
                : bookStore(bookHandle),
        ),
    );
};
