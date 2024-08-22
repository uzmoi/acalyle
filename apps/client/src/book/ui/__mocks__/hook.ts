import type { ID } from "~/lib/graphql";
import type { BookRef, Book } from "../../store";

export const useBookId = (bookRef: BookRef) => {
    return bookRef.startsWith("@") ? `handle__${bookRef.slice(1)}` : bookRef;
};

export const useBook = (bookRef: BookRef): Book => {
    return {
        id: bookRef.startsWith("@") ? ("id" as ID) : (bookRef as ID),
        handle: bookRef.startsWith("@") ? bookRef.slice(1) : "handle",
        title: "Title",
        description: "description",
        thumbnail: "color:red",
        tags: [],
    };
};
