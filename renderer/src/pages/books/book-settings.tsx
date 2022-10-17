import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { BookDeleteForm, BookThumbnailForm, BookTitleForm } from "~/features/book-form";
import { bookSettingsDataQuery } from "./__generated__/bookSettingsDataQuery.graphql";

export const BookSettingsPage: React.FC<{
    id: string;
}> = ({ id }) => {
    const { book } = useLazyLoadQuery<bookSettingsDataQuery>(graphql`
        query bookSettingsDataQuery($id: ID!) {
            book(id: $id) {
                title
            }
        }
    `, { id });

    if(book == null) {
        return <div>book not found (id: {id})</div>;
    }

    return (
        <div className={BookSettingsPageStyle}>
            <BookTitleForm bookId={id} currentTitle={book.title} />
            <BookThumbnailForm bookId={id} />
            <BookDeleteForm bookId={id} />
        </div>
    );
};

const BookSettingsPageStyle = css`
    /* - */
`;
