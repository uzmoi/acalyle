import { useStore } from "@nanostores/react";
import type { ID } from "~/lib/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { type BookRef, bookStore } from "../store";
import { bookHandleStore, handleBookStore } from "../store/book";

export const useBookId = (bookRef: BookRef) => {
    const store = bookHandleStore(
        bookRef.startsWith("@") ? bookRef.slice(1) : "",
    );
    const loader = useStore(store);
    const id = usePromiseLoader(loader);
    return id ?? (bookRef as ID);
};

export const useBook = (bookRef: BookRef) => {
    const store =
        bookRef.startsWith("@") ?
            handleBookStore(bookRef.slice(1))
        :   bookStore(bookRef as ID);
    const loader = useStore(store);
    return usePromiseLoader(loader);
};
