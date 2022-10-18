/* eslint-disable import/unambiguous */

// https://github.com/facebook/relay/blob/main/packages/relay-compiler/README.md
module.exports = {
    src: "./renderer",
    schema: "./data/schema.graphql",
    customScalars: {
        Upload: "null"
    },
    exclude: [
        "**/node_modules/**",
        "**/__mocks__/**",
        "**/__generated__/**",
    ],
    language: "typescript",
    eagerEsModules: true,
};
