import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "~/features/location";
import { Memo } from "~/widgets/book/Memo";
import { link } from "../link";
import { memoQuery } from "./__generated__/memoQuery.graphql";

export const MemoPage: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    // prettier-ignore
    const { book } = useLazyLoadQuery<memoQuery>(graphql`
        query memoQuery($bookId: ID!, $memoId: ID!) {
            book(id: $bookId) {
                memo(id: $memoId) {
                    ...MemoFragment
                }
            }
        }
    `, { bookId, memoId });

    if (book?.memo == null) {
        return <div>not found.</div>;
    }

    return (
        <main
            className={css`
                padding-inline: 2em;
                padding-bottom: 2em;
            `}
        >
            <div
                className={css`
                    padding-block: 1em;
                `}
            >
                <Link to={link("books/:bookId", { bookId })}>
                    return to book
                </Link>
            </div>
            <Memo bookId={bookId} memo={book.memo} />
        </main>
    );
};
