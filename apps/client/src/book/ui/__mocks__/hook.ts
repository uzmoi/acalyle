import type { ID } from "~/__generated__/graphql";
import type { BookRef, Book } from "../../store";

export const useBookId = (bookRef: BookRef) => {
    return bookRef.startsWith("@") ? `handle__${bookRef.slice(1)}` : bookRef;
};

export const useBook = (_bookRef: BookRef): Book => {
    return {
        id: "id" as ID,
        handle: "handle",
        title: "Title",
        description: "description",
        thumbnail: "color:red",
        tags: [],
    };
};
