/* eslint-disable import/unambiguous */
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
