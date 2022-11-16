import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ControlPartOutlineStyle } from "~/shared/control/base";
import { Link } from "~/shared/router/react";
import { BookList } from "~/widgets/book/BookList";
import { booksQuery } from "./__generated__/booksQuery.graphql";

export const BookListPage: React.FC = () => {
    // prettier-ignore
    const queryRef = useLazyLoadQuery<booksQuery>(graphql`
        query booksQuery($count: Int!, $cursor: String) {
            ...BookListFragment
        }
    `, { count: 8 });

    return (
        <div>
            <div className={HeaderStyle}>
                <Link pattern="books/new" className={ControlPartOutlineStyle}>
                    New
                </Link>
            </div>
            <BookList queryRef={queryRef} />
        </div>
    );
};

const HeaderStyle = css`
    display: flex;
    padding-block: 1em;
    padding-inline: 2em;
`;
