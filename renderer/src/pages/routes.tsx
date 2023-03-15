import { type Page, Router, type Routes } from "@acalyle/router";
import { SettingsPage } from "./app/settings";
import { booksRoute } from "./books/routes";

export type RootRoutes = Routes<{
    books: Routes<{
        "": Page;
        new: Page;
        ":bookId": Routes<{
            "": Page;
            ":memoId": Page;
            resources: Page;
            settings: Page;
        }>;
    }>;
    settings: Page;
    ":any*": Page;
}>;

declare global {
    interface AcaRoute {
        route: RootRoutes;
    }
}

export const routes = Router.routes<RootRoutes, JSX.Element>({
    books: booksRoute,
    settings: Router.page(() => <SettingsPage />),
    ":any*": Router.page(params => <>404: {params.any}</>),
});
