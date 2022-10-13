import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { useNavigate } from "~/shared/router/react";
import { Router } from "~/shared/router/router";
import { Book } from "~/widgets/book/Book";
import type { RootRoutes } from "../routes";
import { bookDeleteMutation } from "./__generated__/bookDeleteMutation.graphql";
import { bookQuery } from "./__generated__/bookQuery.graphql";
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
    settings: Router.page(() => <></>),
    /* eslint-enable react/display-name */
});

export const BookChild: React.FC<{
    path: readonly string[];
    id: string;
}> = ({ path, id }) => {
    const [commitDeleteBook, isInFlight] = useMutation<bookDeleteMutation>(graphql`
        mutation bookDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    const navigate = useNavigate();

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                navigate("books");
            },
        });
    };

    return (
        <div>
            {route.get(path, { bookId: id })}
            <button onClick={deleteBook} disabled={isInFlight}>delete book</button>
        </div>
    );
};
