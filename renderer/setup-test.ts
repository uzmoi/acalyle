import { expect } from "vitest";

// @ts-ignore
import jestExtendedMatchers from "jest-extended";
expect.extend(jestExtendedMatchers);

import jestDomMatchers from "@testing-library/jest-dom/matchers";
expect.extend(jestDomMatchers);
