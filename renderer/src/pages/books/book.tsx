import { graphql, useLazyLoadQuery } from "react-relay";
import { Router } from "~/shared/router/router";
import { Book } from "~/widgets/book/Book";
import type { RootRoutes } from "../routes";
import { bookQuery } from "./__generated__/bookQuery.graphql";
import { BookSettingsPage } from "./book-settings";
import { MemoPage } from "./memo";

const BookPage: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!, $count: Int = 100, $cursor: String) {
            book(id: $id) {
                title
                createdAt
                ...BookMemosFragment
            }
        }
    `, { id: bookId });

    if(book == null) {
        return <div>book not found (id: {bookId})</div>;
    }

    return (
        <Book id={bookId} book={book} />
    );
};

const route = Router.routes<Router.GetRoute<RootRoutes, "books/:bookId">, JSX.Element>({
    /* eslint-disable react/display-name */
    "": Router.page(params => <BookPage bookId={params.bookId} />),
    ":memoId": Router.page(params => <MemoPage bookId={params.bookId} memoId={params.memoId} />),
    settings: Router.page(params => <BookSettingsPage id={params.bookId} />),
    /* eslint-enable react/display-name */
});

export const BookChild: React.FC<{
    path: readonly string[];
    id: string;
}> = ({ path, id }) => {
    return (
        <div>
            {route.get(path, { bookId: id })}
        </div>
    );
};
