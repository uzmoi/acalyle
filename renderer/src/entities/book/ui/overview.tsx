import { css } from "@linaria/core";
import { colors } from "~/shared/ui/styles/theme";
import { BookThumbnail } from "./thumbnail";

export const BookOverview: React.FC<{
    thumbnail: string;
    title: string;
}> = ({ thumbnail, title }) => {
    return (
        <div className={BookOverviewStyle}>
            <BookThumbnail src={thumbnail} />
            <p className={BookOverviewTitleStyle}>
                {title}
            </p>
        </div>
    );
};

const BookOverviewStyle = css`
    display: flex;
    height: 6em;
    background-color: ${colors.bgSub};
`;

const BookOverviewTitleStyle = css`
    padding-block: 0.2em;
    padding-inline: 1em;
    font-size: 2em;
`;
