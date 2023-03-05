import { vars } from "@acalyle/ui";
import { css } from "@linaria/core";
import { Link } from "~/features/location";
import { link } from "~/pages/link";

export const Header: React.FC = () => {
    return (
        <header className={HeaderStyle}>
            <Link to={link("books")}>
                <p className={TitleStyle}>Acalyle</p>
            </Link>
        </header>
    );
};

const HeaderStyle = css`
    display: flex;
    align-items: center;
    height: 3em;
    background-color: ${vars.color.bg2};
`;

const TitleStyle = css`
    margin: 0.4em;
    font-size: 1.4em;
`;
