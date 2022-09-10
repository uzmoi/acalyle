import { css, cx } from "@linaria/core";
import { StrictMode, Suspense, useEffect, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { acalyle, relayEnv } from "./acalyle";
import { Header } from "./components/page-parts/header";
import { routes } from "./components/pages/routes";
import { match } from "./router";
import { hashNavigate, useHashLocation } from "./router-react";
import { colors, fonts, themeClassNames, useColorScheme } from "./styles/theme";

css`
    ${":global()"} {
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        body, h1, h2, h3, h4, h5, h6, p, ul, ol, dl, dd {
            margin: 0;
        }
        ul, ol {
            padding-left: 0;
            list-style: none;
        }
        /* #app {} */
        a {
            color: inherit;
        }
    }
`;

const RootStyle = css`
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    font-family: ${fonts.sans};
    color: ${colors.text};
    background-color: ${colors.bg};
`;

export const App: React.FC = () => {
    const location = useHashLocation();

    useEffect(() => {
        if(window.location.hash === "") {
            hashNavigate("books");
        }
    }, []);

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

export const root = (
    <StrictMode>
        <RelayEnvironmentProvider environment={relayEnv}>
            <App />
        </RelayEnvironmentProvider>
    </StrictMode>
);

const Cwd: React.FC = () => {
    const [cwd, setCwd] = useState("");

    useEffect(() => {
        void acalyle.cwd().then(setCwd);
    }, []);

    return <p>{cwd}</p>;
};

if(import.meta.vitest) {
    const { vi, it, expect } = import.meta.vitest;
    vi.mock("./acalyle", () => {
        return {
            acalyle: {
                cwd: vi.fn().mockResolvedValue("cwd"),
            },
            relayEnv: null,
        };
    });
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { render } = await import("@testing-library/react");
    it("vitest test", async () => {
        const { findByText } = render(<Cwd />);
        expect(await findByText("cwd")).toBeInTheDocument();
    });
}
