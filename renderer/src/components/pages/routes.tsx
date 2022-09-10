import { Page, Router, Routes } from "~/router";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export type RootRoutes = Routes<{
    books: Routes<{
        "": Page;
        new: Page;
        ":bookId": Routes<{
            "": Page;
            ":memoId": Page;
            "settings": Page;
        }>;
    }>;
    ":any*": Page;
}>;

declare global {
    interface AcaRoute {
        route: RootRoutes;
    }
}

export const routes = Router.routes<RootRoutes, JSX.Element>({
    books: Router.routes({
        "": Router.page(() => <BookListPage />),
        new: Router.page(() => <NewBookPage />),
        ":bookId": Router.child((path, params) => <BookPage path={path} id={params.bookId} />),
    }),
    ":any*": Router.page(params => <>404: {params.any}</>),
});
