import * as Router from "@acalyle/router";
import { BookListPage } from "./BookListPage";
import { BookPage, type BookPageRoute } from "./BookPage";
import { NewBookPage } from "./NewBookPage";

export type BookRoute = Router.Routes<{
    books: Router.Page;
    new: Router.Page;
    ":bookId": BookPageRoute;
}>;

export const BookRoute = Router.routes<BookRoute, JSX.Element>({
    books: Router.page(() => <BookListPage />),
    new: Router.page(() => <NewBookPage />),
    ":bookId": Router.child((path, params) => (
        <BookPage bookHandle={params.bookId} path={path} />
    )),
});
