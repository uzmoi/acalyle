import { Linter, RuleTester } from "eslint";
import { test } from "vitest";
import { noModuleSideEffect } from "./no-module-side-effect";

test("eslint", () => {
    const ruleTester = new RuleTester({
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    } satisfies Linter.Config);

    ruleTester.run("no-module-side-effect", noModuleSideEffect, {
        valid: [
            "const x = 42;",
            "const f = () => sideEffect();",
            "/* #__PURE__ */ f();",
            "new Hoge;",
            { code: "pure();", options: [{ pureFunctions: ["pure"] }] },
        ],
        invalid: [
            {
                code: "f();",
                errors: [{ suggestions: [{ output: "/* #__PURE__ */ f();" }] }],
            },
            {
                code: "f``;",
                errors: [{ suggestions: [{ output: "/* #__PURE__ */ f``;" }] }],
            },
            {
                code: "new Hoge;",
                errors: [
                    { suggestions: [{ output: "/* #__PURE__ */ new Hoge;" }] },
                ],
                options: [{ allowNew: false }],
            },
            { code: "delete object.property;", errors: [{ suggestions: [] }] },
            { code: "i++;", errors: [{ suggestions: [] }] },
            { code: "i = 1;", errors: [{ suggestions: [] }] },
            { code: "throw error;", errors: [{ suggestions: [] }] },
            { code: "await promise;", errors: [{ suggestions: [] }] },
        ],
    });
});
