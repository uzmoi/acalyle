import { JsonValue } from "emnorst";
import { ExecutionResult, graphql } from "graphql";
import { graphQLSchema } from "./schema";

export const ipcChannels: Record<keyof typeof ipc, string> = {
    cwd: "cwd",
    graphql: "graphql",
};

export const ipc = {
    cwd(): string {
        return process.cwd();
    },
    graphql(query: string, variables: Record<string, JsonValue>): Promise<ExecutionResult> {
        return graphql({
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
