import type { NitrogqlConfig } from "@nitrogql/cli";

const config: NitrogqlConfig = {
    schema: "../../data/schema.graphql",
    documents: "src/**/*.graphql",
    extensions: {
        nitrogql: {
            plugins: ["nitrogql:graphql-scalars-plugin"],
            generate: {
                schemaOutput: "src/__generated__/graphql.ts",
                type: {
                    scalarTypes: {
                        Upload: "null",
                        DateTime: "string",
                        ID: 'import("emnorst").Meta<string, "ID">',
                    },
                },
            },
        },
    },
};

export default config;
