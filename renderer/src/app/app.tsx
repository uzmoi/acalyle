import { css, cx } from "@linaria/core";
import { Suspense, useEffect } from "react";
import { darkThemeStyle, lightThemeStyle, vars } from "~/entities/theme";
import { routes } from "~/pages/routes";
import { match } from "~/shared/router/router";
import { useLocation, useNavigate } from "~/shared/router/react";
import { useColorScheme } from "~/shared/theme";
import { Header } from "~/widgets/layouts/header";

export const App: React.FC = () => {
    const location = useLocation();
    
    const navigate = useNavigate();
    useEffect(() => {
        if(window.location.hash === "") {
            navigate("books");
        }
    }, [navigate]);

    const theme = useColorScheme();

    return (
        <div className={cx(RootStyle)} style={theme === "light" ? lightThemeStyle : darkThemeStyle}>
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
