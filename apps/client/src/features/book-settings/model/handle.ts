import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { $book, type BookHandle } from "~/entities/book";

export const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;
  return 0 < length && length <= 256 && /^[\w-]+$/.test(handle);
};

const $fulfilledNull = /* #__PURE__ */ atom({
  status: "fulfilled",
  value: null,
});

export const useBookHandleStatus = (handle: string | null) => {
  const isValid = handle != null && isValidBookHandle(handle);
  const handleLoader = useStore(
    isValid ? $book.byHandle(handle as BookHandle) : $fulfilledNull,
  );

  if (handle == null) return null;
  if (!isValid) return "invalid";
  if (handleLoader.status !== "fulfilled") return "loading";

  return handleLoader.value == null ? "available" : "unavailable";
};
