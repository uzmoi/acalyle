import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { noteStore } from "~/note/store";

export const useNote = (noteId: ID) => {
    const noteLoader = useStore(noteStore(noteId));
    return usePromiseLoader(noteLoader);
};
