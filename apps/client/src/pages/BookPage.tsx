import * as Router from "@acalyle/router";

export type BookPageRoute = Router.Routes<{
    "": Router.Page;
    ":memoId": Router.Page;
    resources: Router.Page;
    settings: Router.Page;
}>;

const BookPageRoute = Router.routes<BookPageRoute, JSX.Element | null>({
    "": Router.page(() => null),
    resources: Router.page(() => null),
    settings: Router.page(() => null),
    ":memoId": Router.page(() => null),
});

export const BookPage: React.FC<{
    path: readonly string[];
}> = ({ path }) => {
    return <div>{BookPageRoute.get(path, {})}</div>;
};
