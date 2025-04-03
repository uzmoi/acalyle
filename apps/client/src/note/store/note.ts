import { acalyle } from "~/app/main";
import type { ID } from "~/lib/graphql";
import { createQueryStore } from "~/lib/query-store";
import RemoveNoteMutation from "./graphql/remove-note.graphql";
import TransferNoteMutation from "./graphql/transfer-note.graphql";

/** @package */
export type Note = {
    id: ID;
    contents: string;
    tags: readonly string[];
    createdAt: string;
    updatedAt: string;
};

/** @package */
export const noteStore = /* #__PURE__ */ createQueryStore(
    (noteId: ID): Promise<Note | null> => {
        throw new Error("Don't use noteStore");
    },
);

export const removeNote = async (noteId: ID) => {
    const { data: _ } = await acalyle.net.gql(RemoveNoteMutation, { noteId });
    noteStore(noteId).resolve(null);
};

export const transferNote = async (noteId: ID, bookId: ID) => {
    const { data: _ } = await acalyle.net.gql(TransferNoteMutation, {
        noteIds: [noteId],
        bookId,
    });
};
