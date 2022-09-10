import { Page, Router, Routes } from "~/router";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export type RootRoutes = Routes<{
    books: Routes<{
        "": Page;
        new: Page;
        ":id": Page;
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
        ":id": Router.page(params => <BookPage id={params.id} />),
    }),
    ":any*": Router.page(params => <>404: {params.any}</>),
});
