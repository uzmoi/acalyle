import { GetRoute, child, page, routes } from "~/shared/router/router";
import type { RootRoutes } from "../routes";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export const booksRoute = routes<GetRoute<RootRoutes, "books">, JSX.Element>({
    "": page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": child((path, params) => <BookPage path={path} id={params.bookId} />),
});
