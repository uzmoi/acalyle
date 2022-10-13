import { Page, Router, Routes } from "~/shared/router/router";
import { booksRoute } from "./books/routes";

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
    books: booksRoute,
    ":any*": Router.page(params => <>404: {params.any}</>),
});