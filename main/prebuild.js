// @ts-check
/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires */

const { mkdir, open } = require("fs/promises");

(async () => {
    await mkdir("../data", { recursive: true });
    await (await open("../data/schema.graphql", "a")).close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
