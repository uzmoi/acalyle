/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires */

const path = require("path");

// https://github.com/facebook/relay/blob/main/packages/relay-compiler/README.md
module.exports = {
    src: path.join(__dirname, "./src"),
    schema: path.join(__dirname, "../data/schema.graphql"),
    customScalars: {
        Upload: "null",
        DateTime: "string",
    },
    exclude: [
        "**/node_modules/**",
        "**/__mocks__/**",
        "**/__generated__/**",
    ],
    language: "typescript",
    eagerEsModules: true,
};
