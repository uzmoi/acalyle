import { debounce } from "es-toolkit";

export interface WebStorageEntry<T> {
  read(): T;
  readRaw(): string | null;
  save(query: T): void;
  saveRaw(query: string | null): void;
}

export interface DeclareStorageOptions<T> {
  key: string;
  interval?: number;
  storage?: Storage;
  onChanged?: (value: string | null) => void;
  parse: (value: string | null) => T;
  stringify: (value: T) => string | null;
}

const DEFAULT_SAVE_INTERVAL = 100;

export const declareStorage = <T = string | null>({
  key,
  interval = DEFAULT_SAVE_INTERVAL,
  storage = sessionStorage,
  onChanged,
  parse,
  stringify,
}: DeclareStorageOptions<T>): WebStorageEntry<T> => {
  const readRaw = (): string | null => storage.getItem(key);

  const read = (): T => parse(readRaw());

  const saveRaw = (value: string | null): void => {
    if (value == null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
  };

  const save = debounce((query: T) => {
    saveRaw(stringify(query));
  }, interval);

  if (onChanged) {
    // oxlint-disable-next-line prefer-global-this
    window.addEventListener("storage", event => {
      if (event.storageArea === storage && event.key === key) {
        onChanged(event.newValue);
      }
      // event.oldValue;
      // event.url;
    });
  }

  return { read, readRaw, save, saveRaw };
};
