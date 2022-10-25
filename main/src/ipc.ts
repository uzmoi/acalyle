import { JsonValue } from "emnorst";
import { ExecutionResult, graphql } from "graphql";
import { graphQLSchema } from "./gql-schema";
import { createContext } from "./gql-schema/context";

export const ipcChannels: Record<keyof typeof ipc, string> = {
    cwd: "cwd",
    graphql: "graphql",
};

export const ipc = {
    cwd(): string {
        return process.cwd();
    },
    graphql(
        this: { app: Electron.App },
        query: string,
        variables: Record<string, JsonValue>,
        bufs: Record<string, ArrayBuffer> = {},
    ): Promise<ExecutionResult> {
        for(const key of Object.keys(bufs)) {
            const path = key.split(".");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastKey = path.pop()!;
            const obj = path.reduce<Record<string, JsonValue | DataView>>(
                (obj, key) => obj[key] as Record<string, JsonValue>,
                { variables },
            );
            obj[lastKey] = new DataView(bufs[key]);
        }
        return graphql({
            contextValue: createContext(this.app),
            schema: graphQLSchema,
            source: query,
            variableValues: variables,
        });
    },
};

export type IPC = {
    [P in keyof typeof ipc]: typeof ipc[P] extends (
        ...args: infer A
    ) => infer R | PromiseLike<infer R>
        ? (...args: A) => Promise<R>
        : never;
};
