import { useStore } from "@nanostores/react";
import type { ID } from "~/lib/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { noteStore } from "~/note/store";
import type { Note, NoteId } from "./types";

export const useNote = (id: NoteId): Note | null => {
  const store = noteStore(id as string as ID);
  const loader = useStore(store);
  return usePromiseLoader(loader) as Note | null;
};
