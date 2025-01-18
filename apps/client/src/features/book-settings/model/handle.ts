import { useStore } from "@nanostores/react";
import { useState } from "react";
import { bookHandleStore } from "~/book/store/book";

const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;
  return 0 < length && length <= 256 && /^[\w-]+$/.test(handle);
};

export const useBookHandleForm = (currentHandle: string | null) => {
  const [handle, setHandle] = useState(currentHandle ?? "");
  const handleLoader = useStore(bookHandleStore(handle));

  const isAvailable =
    isValidBookHandle(handle) &&
    handleLoader.status === "fulfilled" &&
    handleLoader.value == null;

  const isChanged = handle !== (currentHandle ?? "");

  return {
    handle,
    setHandle,
    isAvailable,
    isChanged,
  };
};
