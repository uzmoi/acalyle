import { type GetRoute, child, page, routes } from "@acalyle/router";
import type { RootRoutes } from "../routes";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export const booksRoute = routes<GetRoute<RootRoutes, "books">, JSX.Element>({
    "": page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": child((path, params) => (
        <BookPage bookId={params.bookId} path={path} />
    )),
});
