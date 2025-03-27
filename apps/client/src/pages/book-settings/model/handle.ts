import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { $book, type BookHandle } from "~/entities/book";

export const normalizeBookHandle = (handle: string): BookHandle => {
  return handle.toLowerCase().replaceAll(/[^_a-z]/g, "_") as BookHandle;
};

export const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;

  // yoda
  // prettier-ignore
  return (0 < length && length <= 256) && /^[\w-]+$/.test(handle);
};

const $fulfilledNull = /* #__PURE__ */ atom({
  status: "fulfilled",
  value: null,
});

export type BookHandleStatus =
  | "invalid"
  | "loading"
  | "available"
  | "unavailable";

export const useBookHandleStatus = (
  handle: string | null,
): BookHandleStatus | null => {
  const isValid = handle != null && isValidBookHandle(handle);
  const handleLoader = useStore(
    isValid ? $book.byHandle(normalizeBookHandle(handle)) : $fulfilledNull,
  );

  if (handle == null) return null;
  if (!isValid) return "invalid";
  if (handleLoader.status !== "fulfilled") return "loading";

  return handleLoader.value == null ? "available" : "unavailable";
};
