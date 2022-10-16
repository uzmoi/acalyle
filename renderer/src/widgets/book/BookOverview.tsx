import { css } from "@linaria/core";
import { colors } from "~/shared/ui/styles/theme";

export const BookOverview: React.FC<{
    title: string;
}> = ({ title }) => {
    return (
        <div className={BookOverviewStyle}>
            <p className={BookOverviewTitleStyle}>
                {title}
            </p>
        </div>
    );
};

const BookOverviewStyle = css`
    height: 6em;
    background-color: ${colors.bgSub};
`;

const BookOverviewTitleStyle = css`
    padding-block: 0.2em;
    padding-inline: 1em;
    font-size: 2em;
`;
