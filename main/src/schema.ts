import {
    connectionPlugin,
    makeSchema,
    queryField,
} from "nexus";
import path = require("path");

export const graphQLSchema = makeSchema({
    types: queryField("data", { type: "String", resolve: () => "Hello nexus" }),
    plugins: [
        connectionPlugin(),
    ],
    nonNullDefaults: { output: true },
    outputs: {
        schema: path.join(__dirname, "../data/schema.graphql"),
        typegen: path.join(__dirname, "../main/src/__generated__/nexus.ts"),
    },
    features: {
        abstractTypeStrategies: {
            __typename: true,
        },
    },
});
