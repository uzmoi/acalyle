import { startTransition, useActionState, useState } from "react";
import { type BookHandle, fetchBookByHandle } from "~/entities/book";

export const normalizeBookHandle = (handle: string): BookHandle => {
  return handle.toLowerCase().replaceAll(/[^_a-z]/g, "_") as BookHandle;
};

export const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;

  // yoda
  // prettier-ignore
  return (0 < length && length <= 256) && /^[\w-]+$/.test(handle);
};

export type BookHandleStatus =
  | "no-change"
  | "invalid"
  | "loading"
  | "available"
  | "unavailable";

export const useBookHandleStatus = (
  initial: string | null,
): [string, BookHandleStatus | null, (x: string) => void] => {
  const [handle, setHandle] = useState<string>(initial ?? "");

  const [state, dispatch, isPending] = useActionState<
    Exclude<BookHandleStatus, "loading"> | null,
    string
  >(async (_, handle) => {
    if (handle === "") return null;
    if (!isValidBookHandle(handle)) return "invalid";
    const normalizedHandle = normalizeBookHandle(handle);
    if (normalizedHandle === initial) return "no-change";
    const book = await fetchBookByHandle(normalizedHandle);
    return book == null ? "available" : "unavailable";
  }, "no-change");

  const update = (handle: string): void => {
    setHandle(handle);
    startTransition(() => {
      dispatch(handle);
    });
  };

  return [handle, isPending ? "loading" : state, update];
};
