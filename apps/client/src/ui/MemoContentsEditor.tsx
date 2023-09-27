import { Button, ControlGroup, Form, TextArea, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useCallback, useMemo, useState } from "react";
import type { Scalars } from "~/__generated__/graphql";
import { createQueryStore } from "~/lib/query-store";
import {
    type NoteDraft,
    loadNoteDraft,
    removeNoteDraft,
    saveNoteDraft,
} from "~/store/draft";
import { memoStore, updateMemoContents } from "~/store/memo";
import { debounce } from "../lib/debounce";
import { usePromiseLoader } from "../lib/promise-loader";
import { NoteBody } from "./note/NoteBody";

const $noteDraft = createQueryStore(
    (noteId: Scalars["ID"]): Promise<NoteDraft | undefined> =>
        loadNoteDraft(noteId),
);

type Conflict = {
    beforeEditing: string;
    current: string;
};

const useNote = (noteId: Scalars["ID"]) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};

export const useNoteDraft = (
    noteId: Scalars["ID"],
): { initContents: string; conflict: Conflict | null } => {
    const noteDraftLoader = useStore($noteDraft(noteId));
    const noteDraft = usePromiseLoader(noteDraftLoader);

    const note = useNote(noteId);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    noteId: Scalars["ID"];
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
        void updateMemoContents(noteId, contents).then(() => {
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
                            color: vars.color.denger,
                            marginBottom: "0.25em",
                        })}
                    >
                        Conflicting edits. This note was edited elsewhere as
                        follows:
                    </p>
                    <NoteBody contents={conflict.current} />
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
