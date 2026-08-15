import { useCallback, useState } from "react";
import type { WebStorageEntry } from "./web-storage";

export const useWebStorage = <T>(
  entry: WebStorageEntry<T>,
): readonly [T, (value: T | ((value: T) => T)) => void] => {
  const [value, setValue] = useState(() => entry.read());

  const set = useCallback(
    (updater: T | ((value: T) => T)) => {
      let newValue: T;
      setValue(
        typeof updater === "function" ?
          value => (newValue = (updater as (value: T) => T)(value))
        : (newValue = updater),
      );
      // 本当にnon-nullか不明。果たしてreactは絶対にsetStateのコールバックを即座に呼んでくれるのか。
      entry.save(newValue!);
    },
    [entry],
  );

  return [value, set];
};
