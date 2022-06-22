import { Route } from "../../router";

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
