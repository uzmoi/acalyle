import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";
import { overview$key } from "./__generated__/overview.graphql";
import { BookThumbnail } from "./thumbnail";

export const BookOverview: React.FC<{
    book: overview$key;
}> = ({ book }) => {
    const { id, title, thumbnail } = useFragment<overview$key>(
        graphql`
            fragment overview on Book {
                id
                title
                thumbnail
            }
        `,
        book,
    );

    return (
        <div className={BookOverviewStyle}>
            <BookThumbnail src={thumbnail} />
            <p className={BookOverviewTitleStyle}>
                <Link to={link("books/:bookId", { bookId: id })}>{title}</Link>
            </p>
        </div>
    );
};

const BookOverviewStyle = css`
    display: flex;
    height: 6em;
    background-color: ${vars.color.bg3};
`;

const BookOverviewTitleStyle = css`
    padding-block: 0.2em;
    padding-inline: 1em;
    font-size: 2em;
`;
