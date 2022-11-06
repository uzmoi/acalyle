import {
    connectionPlugin,
    makeSchema,
    nonNull,
    nullable,
    queryField,
} from "nexus";
import path = require("path");
import { types as bookTypes } from "./book";
import { types as memoTypes } from "./memo";
import { DateTimeScalar, UploadScalar } from "./scalar";
import { Node } from "./util";

const types = [
    queryField("data", { type: "String", resolve: () => "Hello nexus" }),
    queryField("node", {
        type: nullable("Node"),
        args: { id: nonNull("ID") },
    }),
];

export const graphQLSchema = makeSchema({
    types: [Node, DateTimeScalar, UploadScalar, types, bookTypes, memoTypes],
    plugins: [
        connectionPlugin({
            extendConnection: {
                totalCount: { type: nonNull("Int") },
            },
        }),
    ],
    nonNullDefaults: { output: true },
    outputs: {
        schema: path.join(__dirname, "../data/schema.graphql"),
        typegen: path.join(
            __dirname,
            "../main/src/gql-schema/__generated__/nexus.d.ts",
        ),
    },
    contextType: {
        module: path.join(__dirname, "../main/src/gql-schema/context.ts"),
        export: "Context",
    },
    features: {
        abstractTypeStrategies: {
            __typename: true,
        },
    },
});
