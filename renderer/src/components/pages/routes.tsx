import { Route } from "~/router";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";

export type RootRoutes = Route.Routes<{
    books: Route.Routes<{
        "": Route.Page;
        new: Route.Page;
        ":id": Route.Page;
    }>;
    ":any*": Route.Page;
}>;

declare global {
    interface AcaRoute {
        route: RootRoutes;
    }
}

export const routes = Route.routes<RootRoutes, JSX.Element>({
    books: Route.routes({
        "": Route.page(() => <BookListPage />),
        new: Route.page(() => <NewBookPage />),
        ":id": Route.page(params => <BookPage id={params.id} />),
    }),
    ":any*": Route.page(params => <>404: {params.any}</>),
});
