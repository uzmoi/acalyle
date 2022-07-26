import { css } from "@linaria/core";
import { StrictMode, Suspense, useEffect, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { acalyle, relayEnv } from "./acalyle";
import { routes } from "./components/pages/routes";
import { hashNavigate, useHashLocation } from "./router-react";

css`
    ${":global()"} {
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        body {
            margin: 0;
        }
        #app {
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            font-family: sans-serif;
            color: #e0e0e0;
            background-color: #202028;
        }
    }
`;

export const App: React.FC = () => {
    const location = useHashLocation();

    useEffect(() => {
        if(window.location.hash === "") {
            hashNavigate("books");
        }
    }, []);

    return routes.match(location as never);
};

export const root = (
    <StrictMode>
        <RelayEnvironmentProvider environment={relayEnv}>
            <Suspense fallback="loading">
                <App />
            </Suspense>
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
