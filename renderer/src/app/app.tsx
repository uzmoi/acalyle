import { css } from "@linaria/core";
import { Suspense, useCallback, useLayoutEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { useThemeStyle, vars } from "~/entities/theme";
import { useLocation } from "~/features/location";
import { routes } from "~/pages/routes";
import { match } from "~/shared/router";
import { Header } from "~/widgets/layouts/header";
import { RootEl } from "./root-el";

export const App: React.FC = () => {
    const { location, scroll } = useLocation();
    const setRootEl = useSetRecoilState(RootEl);

    const rootEl = useRef<HTMLDivElement | null>(null);
    const rootRef = useCallback<React.RefCallback<HTMLDivElement>>(
        el => {
            rootEl.current = el;
            setRootEl(el);
        },
        [setRootEl],
    );
    useLayoutEffect(() => {
        rootEl.current?.scrollTo(0, scroll);
        document.body.focus();
        document.title = `${location} | Acalyle`;
    }, [location, scroll, setRootEl]);

    const themeStyle = useThemeStyle();

    return (
        <div ref={rootRef} className={RootStyle} style={themeStyle}>
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
