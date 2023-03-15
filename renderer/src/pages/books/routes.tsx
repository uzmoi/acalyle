import { type GetRoute, page, routes } from "@acalyle/router";
import type { RootRoutes } from "../routes";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { MemoPage } from "./memo";
import { NewBookPage } from "./new-book";

export const booksRoute = routes<GetRoute<RootRoutes, "books">, JSX.Element>({
    "": page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": routes({
        "": page(params => <BookPage bookId={params.bookId} tab={0} />),
        resources: page(params => <BookPage bookId={params.bookId} tab={1} />),
        settings: page(params => <BookPage bookId={params.bookId} tab={2} />),
        ":memoId": page(params => (
            <MemoPage bookId={params.bookId} memoId={params.memoId} />
        )),
    }),
});
