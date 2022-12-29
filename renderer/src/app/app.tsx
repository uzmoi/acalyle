import { css } from "@linaria/core";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useThemeStyle, vars } from "~/entities/theme";
import { routes } from "~/pages/routes";
import { match } from "~/shared/router";
import { useLocation, useNavigate } from "~/shared/router/react";
import { Header } from "~/widgets/layouts/header";

export const App: React.FC = () => {
    const location = useLocation();

    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.hash === "") {
            navigate("books");
        }
    }, [navigate]);

    const rootEl = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        rootEl.current?.scrollTo(0, 0);
    }, [location]);

    const themeStyle = useThemeStyle();

    return (
        <div ref={rootEl} className={RootStyle} style={themeStyle}>
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
    background-color: ${vars.color.bg1};
    ::selection {
        background-color: ${vars.color.selection};
    }
`;
