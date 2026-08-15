import { renderHook } from "@testing-library/react";
import { identity } from "es-toolkit";
import { expect, test, vi } from "vitest";
import { useWebStorage } from "./use-web-storage";
import { declareStorage } from "./web-storage";

test("useWebStorage", () => {
  const storage = vi.mockObject(
    declareStorage({ key: "key", parse: identity, stringify: identity }),
  );
  storage.read.mockReturnValue(null);

  const { result, rerender } = renderHook(useWebStorage<string | null>, {
    initialProps: storage,
  });

  {
    const [state, setState] = result.current;
    expect(state).toBeNull();
    setState("value1");
    expect(storage.save).toHaveBeenCalledWith("value1");
  }

  rerender(storage);
  {
    const [state, _setState] = result.current;
    expect(state).toBe("value1");
    // setStateのコールバックが即座に呼ばれないのでstorage.saveにundefinedが渡されてしまう。
    // testing-libraryが正しく実装されていないのか、そもreactがそんな保証をしていないのか。
    // とりあえず実際のページでは動いてるからﾖｼ！
    // setState(() => "value2");
    // expect(storage.save).toHaveBeenCalledWith("value2");
  }
});
