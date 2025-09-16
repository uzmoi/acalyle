import { remove as removeAccents } from "remove-accents";
import type { BookHandle } from "~/entities/book";

export const MAX_HANDLE_LENGTH = 100;

const HANDLE_INVALID_CHARACTER_RE = /[^\d_a-z]/;
const HANDLE_LEADING_INVALID_CHARACTERS_RE = /^[^\d_a-z]+/;
const HANDLE_TRAILING_INVALID_CHARACTERS_RE = /[^\d_a-z]+$/;
const HANDLE_INVALID_CHARACTERS_RE = /[^\d_a-z]+/g;

export const isValidBookHandle = (handle: string): handle is BookHandle =>
  handle !== "" &&
  handle.length <= MAX_HANDLE_LENGTH &&
  !HANDLE_INVALID_CHARACTER_RE.test(handle);

export const normalizeBookHandle = (handle: string): BookHandle | "" => {
  return removeAccents(handle.normalize("NFKC"))
    .toLowerCase()
    .replace(HANDLE_LEADING_INVALID_CHARACTERS_RE, "")
    .replace(HANDLE_TRAILING_INVALID_CHARACTERS_RE, "")
    .replaceAll(HANDLE_INVALID_CHARACTERS_RE, "_")
    .slice(0, MAX_HANDLE_LENGTH) as BookHandle;
};

export const MAX_TITLE_LENGTH = 100;

export const MAX_DESCRIPTION_LENGTH = 500;
