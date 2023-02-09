/* eslint-disable import/unambiguous */

// https://github.com/facebook/relay/blob/main/packages/relay-compiler/README.md
module.exports = {
    src: "./src",
    schema: "../data/schema.graphql",
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
