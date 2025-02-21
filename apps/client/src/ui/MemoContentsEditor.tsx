import { style } from "@acalyle/css";
import { Button, ControlGroup, Form, TextArea, vars } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { useCallback, useMemo, useState } from "react";
import type { ID } from "~/__generated__/graphql";
import { type NoteId, useNote } from "~/entities/note";
import { NoteContents } from "~/entities/note/ui/contents";
import { createQueryStore } from "~/lib/query-store";
import { updateNoteContents } from "~/note/store/note";
import {
    type NoteDraft,
    loadNoteDraft,
    removeNoteDraft,
    saveNoteDraft,
} from "~/store/draft";
import { debounce } from "../lib/debounce";
import { usePromiseLoader } from "../lib/promise-loader";

const $noteDraft = /* #__PURE__ */ createQueryStore(
    (noteId: ID): Promise<NoteDraft | undefined> => loadNoteDraft(noteId),
);

type Conflict = {
    beforeEditing: string;
    current: string;
};

export const useNoteDraft = (
    noteId: ID,
): { initContents: string; conflict: Conflict | null } => {
    const noteDraftLoader = useStore($noteDraft(noteId));
    const noteDraft = usePromiseLoader(noteDraftLoader);

    const note = useNote(noteId as string as NoteId);

    const initContents = noteDraft?.contents ?? note!.contents;

    const conflict = useMemo(() => {
        if (noteDraft == null || note == null) return null;
        if (noteDraft.contentsBeforeEditing === note.contents) return null;
        return {
            beforeEditing: noteDraft.contentsBeforeEditing,
            current: note.contents,
        } satisfies Conflict;
    }, [noteDraft, note]);

    return { initContents, conflict };
};

export const MemoContentsEditor: React.FC<{
    noteId: ID;
    onEditEnd?: () => void;
    onSaved?: () => void;
}> = ({ noteId, onEditEnd, onSaved }) => {
    const { initContents, conflict } = useNoteDraft(noteId);
    const [contents, setContents] = useState(initContents);

    const update = useMemo(() => {
        const save = debounce((contents: string) => {
            void saveNoteDraft(noteId, initContents, contents);
        });
        return (contents: string) => {
            save(contents);
            setContents(contents);
        };
    }, [initContents, noteId]);

    const onSubmit = useCallback(() => {
        onEditEnd?.();
        void updateNoteContents(noteId, contents).then(() => {
            void removeNoteDraft(noteId);
            onSaved?.();
        });
    }, [noteId, contents, onEditEnd, onSaved]);

    return (
        <Form onSubmit={onSubmit}>
            <TextArea value={contents} onValueChange={update} />
            {conflict != null && (
                <div className={style({ marginBlock: "1em" })}>
                    <p
                        className={style({
                            color: vars.color.danger,
                            marginBottom: "0.25em",
                        })}
                    >
                        Conflicting edits. This note was edited elsewhere as
                        follows:
                    </p>
                    <NoteContents contents={conflict.current} />
                </div>
            )}
            <ControlGroup
                className={style({
                    display: "flex",
                    justifyContent: "right",
                    marginTop: "0.5em",
                })}
            >
                <Button onClick={onEditEnd}>Cancel</Button>
                <Button type="submit">Save</Button>
            </ControlGroup>
        </Form>
    );
};
