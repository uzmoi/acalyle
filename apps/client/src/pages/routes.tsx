import {
    type InferPath,
    type MatchParams,
    type Path,
    child,
    page,
    routes,
} from "@acalyle/router";
import { BookListPage } from "./BookListPage";
import { BookPage, type BookPageRoute } from "./BookPage";
import { NewBookPage } from "./NewBookPage";

export type BookRoute = InferPath<typeof BookRoute>;

export const BookRoute = routes({
    books: page(() => <BookListPage />),
    new: page(() => <NewBookPage />),
    ":bookId": child(
        (path: Path<BookPageRoute>, params: MatchParams<"bookId">) => (
            <BookPage bookHandle={params.bookId} path={path} />
        ),
    ),
});
