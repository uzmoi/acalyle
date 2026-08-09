import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// なんかエラー出るので対症療法。
(
  globalThis as unknown as {
    __vite_ssr_import_meta__: unknown;
  }
).__vite_ssr_import_meta__ = { env: { DEV: true } };

afterEach(() => {
  cleanup();
});
