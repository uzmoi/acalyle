import { type GetRoute, page, routes } from "@acalyle/router";
import { ControlGroup, ControlPartOutlineStyle } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "~/features/location";
import { UploadResourceButton } from "~/features/resource";
import { Book } from "~/widgets/book/Book";
import { link } from "../link";
import type { RootRoutes } from "../routes";
import type { bookQuery } from "./__generated__/bookQuery.graphql";
import { BookSettingsPage } from "./book-settings";
import { MemoPage } from "./memo";

/* eslint-disable react/display-name */
const bookRoute = routes<
    GetRoute<RootRoutes, "books/:bookId">,
    (book: NonNullable<bookQuery["response"]["book"]>) => JSX.Element
>({
    "": page(params => book => <Book id={params.bookId} book={book} />),
    resources: page(params => () => (
        <UploadResourceButton bookId={params.bookId} />
    )),
    settings: page(params => () => <BookSettingsPage id={params.bookId} />),
    ":memoId": page(params => () => (
        <MemoPage bookId={params.bookId} memoId={params.memoId} />
    )),
});
/* eslint-enable react/display-name */

export const BookPage: React.FC<{
    bookId: string;
    path: readonly string[];
}> = ({ bookId, path }) => {
    // prettier-ignore
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!, $count: Int = 100, $cursor: String) {
            book(id: $id) {
                title
                createdAt
                ...BookMemosFragment
            }
        }
    `, { id: bookId });

    if (book == null) {
        return <div>book not found (id: {bookId})</div>;
    }

    return (
        <main className={style({ padding: "2em" })}>
            <h2 className={style({ paddingBottom: "1em" })}>{book.title}</h2>
            <ControlGroup>
                <Link
                    to={link("books/:bookId", { bookId })}
                    className={ControlPartOutlineStyle}
                >
                    Memos
                </Link>
                <Link
                    to={link("books/:bookId/resources", { bookId })}
                    className={ControlPartOutlineStyle}
                >
                    Resources
                </Link>
                <Link
                    to={link("books/:bookId/settings", { bookId })}
                    className={ControlPartOutlineStyle}
                >
                    Settings
                </Link>
            </ControlGroup>
            {bookRoute.get(path, { bookId })?.(book)}
        </main>
    );
};
