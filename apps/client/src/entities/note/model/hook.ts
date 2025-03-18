import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $note } from "./store";
import type { Note, NoteId } from "./types";

export const useNote = (id: NoteId): Note => {
  const loader = useStore($note(id));
  const note = usePromiseLoader(loader);

  if (note == null) {
    throw new Error(`Note (id: ${id}) not exists`);
  }

  return note;
};
