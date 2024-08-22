import { useStore } from "@nanostores/react";
import type { ID } from "~/lib/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { noteStore } from "../store";

export const useNote = (noteId: ID) => {
    const store = noteStore(noteId);
    const loader = useStore(store);
    return usePromiseLoader(loader);
};
