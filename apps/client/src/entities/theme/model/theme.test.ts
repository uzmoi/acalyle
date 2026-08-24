import { describe, expect, test } from "vitest";
import { FALLBACK_THEME, getColor, normalizeColor } from "./theme";

const onceGetProxy = <T extends object>(object: T): T => {
  const accessedKeys = new Set<string | symbol>();
  return new Proxy(object, {
    get(target, key, receiver) {
      if (accessedKeys.has(key)) {
        throw new Error(`${String(key)} has already been accessed`);
      }
      accessedKeys.add(key);
      return Reflect.get(target, key, receiver);
    },
  });
};

describe("getColor", () => {
  test("Resolve linked value", () => {
    const theme = {
      ...FALLBACK_THEME,
      "app-bg": "#123456",
      "tag-bg": "$app-bg",
    } as const;
    expect(getColor(theme, "tag-bg")).toBe(theme["app-bg"]);
  });

  test("Fallback to FALLBACK_THEME when link loop occurs", () => {
    const theme = {
      ...FALLBACK_THEME,
      "app-bg": "$tag-bg",
      "tag-bg": "$app-bg",
    } as const;
    expect(getColor(onceGetProxy(theme), "tag-bg")).toBe(
      // FALLBACK_THEME["tag-bg"] が $app-bg なので
      FALLBACK_THEME["app-bg"],
    );
  });
});

describe("normalizeColor", () => {
  test("#rgb is normalized to #rrggbb", () => {
    expect(normalizeColor("#123")).toBe("#112233");
  });

  test("#rgba is normalized to #rrggbbaa", () => {
    expect(normalizeColor("#1234")).toBe("#11223344");
  });

  test("#rgb0 is normalized to 'transparent'", () => {
    expect(normalizeColor("#1230")).toBe("transparent");
  });

  test("#rrggbb00 is normalized to 'transparent'", () => {
    expect(normalizeColor("#12345600")).toBe("transparent");
  });
});
