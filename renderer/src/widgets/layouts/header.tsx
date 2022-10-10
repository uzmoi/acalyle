import { css } from "@linaria/core";
import { Link } from "~/shared/router/react";
import { colors } from "~/shared/ui/styles/theme";

export const Header: React.FC = () => {
    return (
        <header className={HeaderStyle}>
            <Link pattern="books">
                <p className={TitleStyle}>Acalyle</p>
            </Link>
        </header>
    );
};

const HeaderStyle = css`
    display: flex;
    align-items: center;
    height: 3em;
    background-color: ${colors.bgSub};
`;

const TitleStyle = css`
    margin: 0.4em;
    font-size: 1.4em;
`;
