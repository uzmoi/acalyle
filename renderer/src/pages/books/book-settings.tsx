import { css } from "@linaria/core";
import { useCallback } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { BookTitleForm } from "~/features/book-form";
import { BookThumbnailForm } from "~/features/book-thumbnail";
import { BookDeleteForm } from "~/features/delete-book";
import { useNavigate } from "~/features/location";
import { link } from "../link";
import { bookSettingsDataQuery } from "./__generated__/bookSettingsDataQuery.graphql";

export const BookSettingsPage: React.FC<{
    id: string;
}> = ({ id }) => {
    // prettier-ignore
    const { book } = useLazyLoadQuery<bookSettingsDataQuery>(graphql`
        query bookSettingsDataQuery($id: ID!) {
            book(id: $id) {
                title
            }
        }
    `, { id });

    const navigate = useNavigate();
    const navigateToBookListPage = useCallback(() => {
        navigate(link("books"));
    }, [navigate]);

    if (book == null) {
        return <div>book not found (id: {id})</div>;
    }

    return (
        <div className={BookSettingsPageStyle}>
            <BookTitleForm bookId={id} currentTitle={book.title} />
            <BookThumbnailForm bookId={id} />
            <BookDeleteForm
                bookId={id}
                confirmText={`delete-${book.title}`}
                onDeleted={navigateToBookListPage}
            />
        </div>
    );
};

const BookSettingsPageStyle = css`
    /* - */
`;
