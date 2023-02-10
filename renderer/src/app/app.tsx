import { match } from "@acalyle/router";
import { css } from "@linaria/core";
import { Suspense, useLayoutEffect } from "react";
import { useThemeStyle, vars } from "~/entities/theme";
import { useLocation } from "~/features/location";
import { routes } from "~/pages/routes";
import { Header } from "~/widgets/layouts/header";
import { rootEl } from "./root-el";

export const App: React.FC = () => {
    const { location, scroll } = useLocation();

    useLayoutEffect(() => {
        rootEl.current?.scrollTo(0, scroll);
        document.body.focus();
        document.title = `${location} | Acalyle`;
    }, [location, scroll]);

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
