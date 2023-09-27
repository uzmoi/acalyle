import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore } from "~/store/memo";

export const useNote = (noteId: Scalars["ID"]) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};
