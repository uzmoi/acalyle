import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { $note } from "./store";
import type { Note, NoteId } from "./types";

export const useNote = (id: NoteId): Note | null => {
  const loader = useStore($note(id));
  return usePromiseLoader(loader);
};
