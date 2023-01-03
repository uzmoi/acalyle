import { ExecutionResult, graphql } from "graphql";
import { graphQLSchema } from "./gql-schema";
import { createContext } from "./gql-schema/context";
import { BodyData, mapBuffers } from "./gql-schema/util";

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
        body: string,
        buffers: Record<string, ArrayBuffer> = {},
    ): Promise<ExecutionResult> {
        const bodyData = JSON.parse(body) as BodyData;
        mapBuffers(bodyData, buffers);

        return graphql({
            contextValue: createContext(this.app),
            schema: graphQLSchema,
            source: bodyData.query,
            variableValues: bodyData.variables,
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
