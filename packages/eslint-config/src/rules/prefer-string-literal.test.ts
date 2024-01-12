import { Linter, RuleTester } from "eslint";
import { test } from "vitest";
import { preferStringLiteral } from "./prefer-string-literal";

test("eslint", () => {
    const ruleTester = new RuleTester({
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    } satisfies Linter.Config);

    ruleTester.run("prefer-string-literal", preferStringLiteral, {
        valid: ['"";', "tag``;", "`\n`"],
        invalid: [
            {
                code: "``;",
                errors: [{}],
                output: '"";',
            },
            {
                code: '`""\\`\\``;',
                errors: [{}],
                output: '"\\"\\"``";',
            },
        ],
    });
});
