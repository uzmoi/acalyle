import { css, cx } from "@linaria/core";
import { Suspense, useEffect } from "react";
import { vars } from "~/entities/theme";
import { routes } from "~/pages/routes";
import { useLocation, useNavigate } from "~/shared/router/react";
import { match } from "~/shared/router/router";
import { useThemeStyle } from "~/shared/theme";
import { Header } from "~/widgets/layouts/header";

export const App: React.FC = () => {
    const location = useLocation();
    
    const navigate = useNavigate();
    useEffect(() => {
        if(window.location.hash === "") {
            navigate("books");
        }
    }, [navigate]);

    const themeStyle = useThemeStyle();

    return (
        <div className={cx(RootStyle)} style={themeStyle}>
            <Header />
            <Suspense fallback="loading">
                {match(routes, location as never)}
            </Suspense>
        </div>
    );
};

const RootStyle = css`
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    font-family: ${vars.font.sans};
    color: ${vars.color.text};
    background-color: ${vars.color.bg};
`;
