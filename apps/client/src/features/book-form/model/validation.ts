import type { BookHandle } from "~/entities/book";

export const MAX_HANDLE_LENGTH = 100;

export const isValidBookHandle = (handle: string): boolean => {
  const length = handle.length;

  // yoda
  // prettier-ignore
  return (0 < length && length <= 256) && /^[\w-]+$/.test(handle);
};

export const normalizeBookHandle = (handle: string): BookHandle => {
  return handle.toLowerCase().replaceAll(/[^_a-z]/g, "_") as BookHandle;
};

export const MAX_TITLE_LENGTH = 100;

export const MAX_DESCRIPTION_LENGTH = 500;
