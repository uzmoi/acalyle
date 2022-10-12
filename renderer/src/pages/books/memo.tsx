import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "~/shared/router/react";
import { Memo } from "~/widgets/book/Memo";
import { memoQuery } from "./__generated__/memoQuery.graphql";

export const MemoPage: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    const { book } = useLazyLoadQuery<memoQuery>(graphql`
        query memoQuery($bookId: ID!, $memoId: ID!) {
            book(id: $bookId) {
                memo(id: $memoId) {
                    ...MemoFragment
                }
            }
        }
    `, { bookId, memoId });

    if(book == null) {
        return (
            <div className={MemoPageStyle}>
                book not found.
            </div>
        );
    }

    return (
        <div className={MemoPageStyle}>
            <Link pattern="books/:bookId" params={{ bookId }}>
                return to book
            </Link>
            <Memo bookId={bookId} fragmentRef={book.memo} />
        </div>
    );
};

const MemoPageStyle = css`
    /* - */
`;
