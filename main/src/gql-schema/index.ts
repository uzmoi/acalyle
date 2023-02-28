import { connectionPlugin, makeSchema, nonNull, queryField } from "nexus";
import path = require("path");
import { types as bookTypes } from "./book";
import { types as memoTypes } from "./memo";
import { Node, nodeQuery } from "./node";
import { DateTimeScalar, UploadScalar } from "./scalar";
import * as tagTypes from "./tag";

export const graphQLSchema = makeSchema({
    types: [
        queryField("data", { type: "String", resolve: () => "Hello nexus" }),
        Node,
        nodeQuery,
        DateTimeScalar,
        UploadScalar,
        bookTypes,
        memoTypes,
        tagTypes,
    ],
    plugins: [
        connectionPlugin({
            extendConnection: {
                totalCount: { type: nonNull("Int") },
            },
            nonNullDefaults: { output: false },
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
