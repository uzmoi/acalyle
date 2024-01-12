import type { CodegenConfig } from "@graphql-codegen/cli";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript";
import type { TypeScriptDocumentsPluginConfig } from "@graphql-codegen/typescript-operations";

export default {
    schema: "../../data/schema.graphql",
    documents: "src/**/*.ts",
    generates: {
        "src/__generated__/graphql.ts": {
            plugins: ["typescript", "typescript-operations"],
            config: {
                constEnums: true,
                strictScalars: true,
                typesPrefix: "Gql",
                useTypeImports: true,
                scalars: {
                    Upload: "null",
                    DateTime: "string",
                    ID: 'import("emnorst").Meta<string, "ID">',
                },
                arrayInputCoercion: false,
                immutableTypes: true,
            } satisfies TypeScriptPluginConfig &
                TypeScriptDocumentsPluginConfig,
        },
    },
} satisfies CodegenConfig;
