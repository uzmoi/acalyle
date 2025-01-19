import { useStore } from "@nanostores/react";
import { bookHandleStore } from "~/book/store/book";

export const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;
  return 0 < length && length <= 256 && /^[\w-]+$/.test(handle);
};

export const useBookHandleStatus = (handle: string | null) => {
  const isValid = handle != null && isValidBookHandle(handle);
  const handleLoader = useStore(bookHandleStore(isValid ? handle : ""));

  if (handle == null) return null;
  if (!isValid) return "invalid";
  if (handleLoader.status !== "fulfilled") return "loading";

  return handleLoader.value == null ? "available" : "unavailable";
};
