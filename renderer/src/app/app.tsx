import { css, cx } from "@linaria/core";
import { Suspense, useEffect } from "react";
import { routes } from "~/pages/routes";
import { match } from "~/shared/router/router";
import { useLocation, useNavigate } from "~/shared/router/react";
import { colors, fonts, themeClassNames, useColorScheme } from "~/shared/ui/styles/theme";
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
        <div className={cx(RootStyle, themeClassNames[theme])}>
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
    font-family: ${fonts.sans};
    color: ${colors.text};
    background-color: ${colors.bg};
`;
