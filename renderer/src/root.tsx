import { css } from "@linaria/core";
import { StrictMode, Suspense, VFC, useEffect, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { acalyle, relayEnv } from "./acalyle";
import { BookListPage } from "./components/pages/books";

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
    }
`;

export const App: VFC = () => {
    return (
        <div>
            <BookListPage />
        </div>
    );
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

const Cwd: VFC = () => {
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
