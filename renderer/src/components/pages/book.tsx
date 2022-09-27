import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { Router } from "~/router";
import { hashNavigate } from "~/router-react";
import { Book } from "../data/Book";
import { bookDeleteMutation } from "./__generated__/bookDeleteMutation.graphql";
import { bookQuery, bookQuery$data } from "./__generated__/bookQuery.graphql";
import type { RootRoutes } from "./routes";

const route = Router.routes<
    Router.GetRoute<RootRoutes, "books/:bookId">,
    (book: NonNullable<bookQuery$data["book"]>) => JSX.Element
>({
    /* eslint-disable react/display-name */
    "": Router.page(params => book => <Book id={params.bookId} book={book} />),
    ":memoId": Router.page(() => () => <></>),
    settings: Router.page(() => () => <></>),
    /* eslint-enable react/display-name */
});

export const BookPage: React.FC<{
    path: readonly string[];
    id: string;
}> = ({ path, id }) => {
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!, $count: Int = 100, $cursor: String) {
            book(id: $id) {
                title
                createdAt
                ...BookMemosFragment
            }
        }
    `, { id });

    const [commitDeleteBook, isInFlight] = useMutation<bookDeleteMutation>(graphql`
        mutation bookDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    if(book == null) {
        return <div>book not found (id: {id})</div>;
    }

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                hashNavigate("books");
            },
        });
    };

    return (
        <div>
            {route.get(path, { bookId: id })?.(book)}
            <button onClick={deleteBook} disabled={isInFlight}>delete book</button>
        </div>
    );
};
