import { css } from "@linaria/core";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useThemeStyle, vars } from "~/entities/theme";
import { useLocation, useNavigate } from "~/features/location";
import { routes } from "~/pages/routes";
import { match } from "~/shared/router";
import { Header } from "~/widgets/layouts/header";

export const App: React.FC = () => {
    const location = useLocation();

    const navigate = useNavigate();
    const isEmptyLocation = location === "";
    useEffect(() => {
        if (isEmptyLocation) {
            navigate("books");
        }
    }, [isEmptyLocation, navigate]);

    const rootEl = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        rootEl.current?.scrollTo(0, 0);
        document.body.focus();
        document.title = `${location} | Acalyle`;
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
    overflow: hidden auto;
    font-family: ${vars.font.sans};
    color: ${vars.color.text};
    background-color: ${vars.color.bg1};
    ::selection {
        background-color: ${vars.color.selection};
    }
`;
