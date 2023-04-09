import { connectionPlugin, makeSchema, nonNull, queryField } from "nexus";
import path = require("path");
import * as bookTypes from "./book";
import * as memoTypes from "./memo";
import { Node, nodeQuery } from "./node";
import { uploadResourceMutation } from "./resource";
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
        uploadResourceMutation,
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
    shouldExitAfterGenerateArtifacts: !!process.env.CODEGEN,
    outputs: {
        schema: path.join(__dirname, "../../data/schema.graphql"),
        typegen: path.join(
            __dirname,
            "../src/gql-schema/__generated__/nexus.ts",
        ),
    },
    contextType: {
        module: path.join(__dirname, "../src/gql-schema/context.ts"),
        export: "Context",
    },
    features: {
        abstractTypeStrategies: {
            __typename: true,
        },
    },
});
