import { type ReadableAtom, map, onMount, onSet } from "nanostores";
import { derived } from "~/lib/derived";
import {
  type PromiseLoaderExt,
  type PromiseLoaderW,
  createPromiseLoaderAtom,
} from "~/lib/promise-loader";
import { fetchBook, fetchBookByHandle } from "../api";
import type { Book, BookHandle, BookId } from "./types";

type Store = ReadableAtom<PromiseLoaderW<Book | null>>;

const atomMap = new Map<BookId, Store & PromiseLoaderExt>();

export const $book = (id: BookId): Store & PromiseLoaderExt => {
  const entry = atomMap.get(id);

  if (entry != null) return entry;

  const atom = createPromiseLoaderAtom<Book | null>();

  onMount(atom, () => {
    if (atom.get().status === "unpending") {
      atom.pending(fetchBook(id));
    }
  });

  onSet(atom, ({ newValue }) => {
    if (newValue.status === "fulfilled") {
      const handle = newValue.value?.handle;
      if (handle != null) {
        $handles.setKey(handle, id);
      }
    }
  });

  atomMap.set(id, atom);

  return atom;
};

const handleAtomMap = new Map<BookHandle, Store>();
const $handles = /* #__PURE__ */ map<
  Record<BookHandle, Promise<void> | BookId | null>
>({});

// eslint-disable-next-line pure-module/pure-module
$book.byHandle = (handle: BookHandle): Store => {
  const entry = handleAtomMap.get(handle);

  if (entry != null) return entry;

  const atom = derived((get): PromiseLoaderW<Book | null> => {
    const handles = get($handles);
    const id = handles[handle];
    if (id instanceof Promise) {
      return { status: "pending", promise: id };
    }
    if (id === undefined) {
      const fetching = fetchBookByHandle(handle).then(book => {
        if (book == null) {
          $handles.setKey(handle, null);
        } else {
          $book(book.id).resolve(book);
        }
      });
      handles[handle] = fetching;
      return { status: "pending", promise: fetching };
    }
    if (id === null) {
      return { status: "fulfilled", value: null };
    }
    return get($book(id));
  });

  handleAtomMap.set(handle, atom);

  return atom;
};
