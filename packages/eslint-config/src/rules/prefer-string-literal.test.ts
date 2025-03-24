import { RuleTester } from "eslint";
import { test } from "vitest";
import { preferStringLiteral } from "./prefer-string-literal";

test("eslint", () => {
  const ruleTester = new RuleTester();

  ruleTester.run("prefer-string-literal", preferStringLiteral, {
    valid: ['"";', "tag``;", "`\n`"],
    invalid: [
      {
        code: "``;",
        errors: [{ message: "Prefer string literal." }],
        output: '"";',
      },
      {
        code: '`""\\`\\``;',
        errors: [{ message: "Prefer string literal." }],
        output: '"\\"\\"``";',
      },
    ],
  });
});
