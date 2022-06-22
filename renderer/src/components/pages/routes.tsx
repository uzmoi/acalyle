import { Route } from "../../router";
import { BookPage } from "./book";
import { BookListPage } from "./books";
import { NewBookPage } from "./new-book";
import { RootRoutes } from "./routes-def";

export const routes = Route.routes<RootRoutes, JSX.Element>({
    books: Route.routes({
        "": Route.page(() => <BookListPage />),
        new: Route.page(() => <NewBookPage />),
        ":id": Route.page(params => <BookPage id={params.id} />),
    }),
    ":any*": Route.page(params => <>404: {params.any}</>),
});
