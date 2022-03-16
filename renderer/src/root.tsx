import { css } from "@linaria/core";
import { StrictMode, Suspense, useEffect, useState, VFC } from "react";
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay";
import { acalyle, relayEnv } from "./acalyle";
import { rootQuery } from "./__generated__/rootQuery.graphql";

const Cwd: VFC = () => {
    const [cwd, setCwd] = useState("");

    useEffect(() => {
        acalyle.cwd().then(setCwd);
    }, []);

    return <p>{cwd}</p>;
};

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

export const App: VFC = ({  }) => {
    const { data } = useLazyLoadQuery<rootQuery>(graphql`
        query rootQuery {
            data
        }
    `, {});

    return (
        <div>
            {data}
        </div>
    );
};

export const root = (
    <StrictMode>
        <RelayEnvironmentProvider environment={relayEnv}>
            <Cwd />
            <Suspense fallback="loading">
                <App />
            </Suspense>
        </RelayEnvironmentProvider>
    </StrictMode>
);

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
    const { render } = await import("@testing-library/react");
    it("vitest test", async () => {
        const { findByText } = render(<Cwd />);
        expect(await findByText("cwd")).toBeInTheDocument();
    });
}
