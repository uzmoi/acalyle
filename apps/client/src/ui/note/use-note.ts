import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore } from "~/store/memo";

export const useNote = (noteId: ID) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};
