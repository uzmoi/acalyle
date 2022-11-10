import { GetRoute, page, routes } from "~/shared/router";
import type { RootRoutes } from "../routes";
import { BookPage } from "./book";
import { BookSettingsPage } from "./book-settings";
import { BookListPage } from "./books";
import { MemoPage } from "./memo";
import { NewBookPage } from "./new-book";

export const booksRoute = routes<GetRoute<RootRoutes, "books">, JSX.Element>({
    "": page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": routes({
        "": page(params => <BookPage bookId={params.bookId} />),
        settings: page(params => <BookSettingsPage id={params.bookId} />),
        ":memoId": page(params => (
            <MemoPage bookId={params.bookId} memoId={params.memoId} />
        )),
    }),
});
