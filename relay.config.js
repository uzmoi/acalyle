module.exports = {
    src: "./renderer/src",
    schema: "./data/schema.graphql",
    exclude: [
        "**/node_modules/**",
        "**/__mocks__/**",
        "**/__generated__/**",
    ],
    language: "typescript",
};
