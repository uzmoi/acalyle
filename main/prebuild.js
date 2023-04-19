// @ts-check
/* eslint-disable import/unambiguous */

const { mkdir, open } = require("fs/promises");

(async () => {
    await mkdir("../data", { recursive: true });
    await (await open("../data/schema.graphql", "a")).close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
