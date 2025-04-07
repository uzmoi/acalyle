import { describe, expect, test } from "vitest";
import { corner } from "./style-utilities";

describe("corner", () => {
  test("upper-left", () => {
    expect(corner("upper", "left")).toEqual({
      position: "absolute",
      top: 0,
      left: 0,
      translate: "-50% -50%",
    });
  });
  test("lower-right", () => {
    expect(corner("lower", "right")).toEqual({
      position: "absolute",
      bottom: 0,
      right: 0,
      translate: "50% 50%",
    });
  });
});
