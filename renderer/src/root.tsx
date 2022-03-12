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
