import { type WritableAtom, onMount } from "nanostores";
import {
  type PromiseLoaderExt,
  type PromiseLoaderW,
  createPromiseLoaderAtom,
} from "~/lib/promise-loader";
import { fetchNote } from "../api";
import type { Note, NoteId } from "./types";

type Store = WritableAtom<PromiseLoaderW<Note | null>> & PromiseLoaderExt;

const atomMap = new Map<NoteId, Store>();

export const $note = (id: NoteId): Store => {
  const entry = atomMap.get(id);

  if (entry != null) return entry;

  const atom = createPromiseLoaderAtom<Note | null>();

  onMount(atom, () => {
    if (atom.get().status === "unpending") {
      atom.pending(fetchNote(id));
    }
  });

  atomMap.set(id, atom);

  return atom;
};
