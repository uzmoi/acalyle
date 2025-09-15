import { startTransition, useActionState, useState } from "react";
import { fetchBookByHandle } from "~/entities/book";
import { normalizeBookHandle, isValidBookHandle } from "~/features/book-form";

export type BookHandleStatus =
  | "no-change"
  | "invalid"
  | "loading"
  | "available"
  | "unavailable"
  | "unknown";

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
    const result = await fetchBookByHandle(normalizedHandle);
    return result.mapOr("unknown", book =>
      book == null ? "available" : "unavailable",
    );
  }, "no-change");

  const update = (handle: string): void => {
    setHandle(handle);
    startTransition(() => {
      dispatch(handle);
    });
  };

  return [handle, isPending ? "loading" : state, update];
};
