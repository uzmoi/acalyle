/* eslint-disable import/no-extraneous-dependencies */

// eslint-disable-next-line import/no-unresolved
import "react/next";
import "vite/client";
import "vitest/importMeta";
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare global {
    namespace jest {
        // eslint-disable-next-line
        interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
    }
}
