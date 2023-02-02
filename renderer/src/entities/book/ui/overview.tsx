import { css } from "@linaria/core";
import { vars } from "~/entities/theme";
import { link } from "~/pages/link";
import { Link } from "~/shared/router/react";
import { BookThumbnail } from "./thumbnail";

export const BookOverview: React.FC<{
    bookId: string;
    thumbnail: string;
    title: string;
}> = ({ bookId, thumbnail, title }) => {
    return (
        <div className={BookOverviewStyle}>
            <BookThumbnail src={thumbnail} />
            <p className={BookOverviewTitleStyle}>
                <Link to={link("books/:bookId", { bookId })}>{title}</Link>
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
