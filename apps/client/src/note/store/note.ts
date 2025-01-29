import { acalyle } from "~/app/main";
import type { ID } from "~/lib/graphql";
import { createQueryStore } from "~/lib/query-store";
import AddMemoTagsMutation from "./graphql/add-memo-tags.graphql";
import NoteTemplateQuery from "./graphql/note-template.graphql";
import RemoveNoteMutation from "./graphql/remove-note.graphql";
import TransferNoteMutation from "./graphql/transfer-note.graphql";
import UpdateNoteContentsMutation from "./graphql/update-note-contents.graphql";

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
    async (noteId: ID): Promise<Note | null> => {
        const { data } = await acalyle.net.gql(NoteQuery, { noteId });
        return data.memo ?? null;
    },
);

export const noteTemplateStore = /* #__PURE__ */ createQueryStore(
    async (bookId: ID) => {
        const { data } = await acalyle.net.gql(NoteTemplateQuery, { bookId });
        return data.book?.tagProps;
    },
);

export const removeNote = async (noteId: ID) => {
    const { data: _ } = await acalyle.net.gql(RemoveNoteMutation, { noteId });
    noteStore(noteId).resolve(null);
};

export const updateNoteContents = async (
    noteId: ID,
    contents: string,
): Promise<void> => {
    const { data } = await acalyle.net.gql(UpdateNoteContentsMutation, {
        noteId,
        contents,
    });

    if (data.updateMemoContents != null) {
        noteStore(noteId).resolve({
            id: noteId,
            ...data.updateMemoContents,
        });
    }
};

/** @deprecated */
export const addMemoTags = async (memoId: ID, tags: readonly string[]) => {
    const { data } = await acalyle.net.gql(AddMemoTagsMutation, {
        memoId,
        tags: [...tags],
    });

    for (const memo of data.addMemoTags) {
        if (memo != null) {
            noteStore(memo.id).resolve(memo);
        }
    }
};

export const transferNote = async (noteId: ID, bookId: ID) => {
    const { data: _ } = await acalyle.net.gql(TransferNoteMutation, {
        noteIds: [noteId],
        bookId,
    });
};
