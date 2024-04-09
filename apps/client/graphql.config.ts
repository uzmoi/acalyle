import type { NitrogqlConfig } from "@nitrogql/cli";
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const schemaPath = require.resolve("@acalyle/server/schema.graphql");

// nitrogqlがschemaを読むのにrustのglob-matchクレートを使っている模様
// その影響で、`../`が使えずエラーが出るので、コピーしてきてから読む
const copiedSchemaPath = "./__generated__/schema.graphql";
await mkdir("./__generated__", { recursive: true });
await copyFile(schemaPath, copiedSchemaPath);

const config: NitrogqlConfig = {
    schema: copiedSchemaPath,
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
