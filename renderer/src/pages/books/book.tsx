import { ControlGroup, ControlPartOutlineStyle } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "~/features/location";
import { UploadResourceButton } from "~/features/resource";
import { Book } from "~/widgets/book/Book";
import { link } from "../link";
import type { bookQuery } from "./__generated__/bookQuery.graphql";
import { BookSettingsPage } from "./book-settings";

export const BookPage: React.FC<{
    bookId: string;
    tab?: number;
}> = ({ bookId, tab }) => {
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
            {tab === 0 && <Book id={bookId} book={book} />}
            {tab === 1 && <UploadResourceButton bookId={bookId} />}
            {tab === 2 && <BookSettingsPage id={bookId} />}
        </main>
    );
};
