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
    const { id, title, description, thumbnail } = useFragment<overview$key>(
        graphql`
            fragment overview on Book {
                id
                title
                description
                thumbnail
            }
        `,
        book,
    );

    return (
        <div
            className={css`
                display: flex;
                height: 6em;
                background-color: ${vars.color.bg3};
                > :first-child /* BookThumbnail */ {
                    flex: 0 0 auto;
                }
            `}
        >
            <BookThumbnail src={thumbnail} />
            <div
                className={css`
                    flex: 1 1 0;
                    padding-block: 0.75em;
                    padding-inline: 1em;
                    overflow: hidden;
                    white-space: nowrap;
                `}
            >
                <p
                    className={css`
                        margin-bottom: 0.25em;
                        font-size: 2em;
                        line-height: 1;
                    `}
                >
                    <Link to={link("books/:bookId", { bookId: id })}>
                        {title}
                    </Link>
                </p>
                <p
                    className={css`
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `}
                >
                    {description}
                </p>
            </div>
        </div>
    );
};


