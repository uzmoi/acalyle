import { GetRoute, child, page, routes } from "~/shared/router/router";
import type { RootRoutes } from "../routes";
import { BookChild } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export const booksRoute = routes<GetRoute<RootRoutes, "books">, JSX.Element>({
    "": page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": child((path, params) => <BookChild path={path} id={params.bookId} />),
});
