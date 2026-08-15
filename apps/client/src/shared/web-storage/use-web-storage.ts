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
      entry.save(newValue!);
    },
    [entry],
  );

  return [value, set];
};
