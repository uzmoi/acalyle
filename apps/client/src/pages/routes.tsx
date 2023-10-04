/* eslint-disable acalyle/no-module-side-effect */
import { type InferPath, page, routes } from "@acalyle/router";
import { BookListPage } from "./BookListPage";
import { BookPageRoute } from "./BookPage";
import { NewBookPage } from "./NewBookPage";

export type BookRoute = InferPath<typeof BookRoute>;

export const BookRoute = routes({
    books: page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": BookPageRoute,
}).default(path => (
    <div>Page not found (path: &quot;/{path.join("/")}&quot;)</div>
));
