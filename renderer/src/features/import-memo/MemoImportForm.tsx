import { Button, ControlGroup, FileInput, Form } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { MemoImportFormMutation } from "./__generated__/MemoImportFormMutation.graphql";
import { fileToMemoInput } from "./from-file";

export const MemoImportForm: React.FC<{
    bookId: string;
    onCancel?: () => void;
}> = ({ bookId, onCancel }) => {
    const [commit, isInFlight] = useMutation<MemoImportFormMutation>(graphql`
        mutation MemoImportFormMutation($bookId: ID!, $memos: [MemoInput!]!) {
            importMemos(bookId: $bookId, memos: $memos)
        }
    `);

    const [files, setFiles] = useState<FileList>();

    const onSubmit = useCallback(() => {
        if (files != null) {
            void Promise.all([...files].map(fileToMemoInput)).then(memos => {
                commit({
                    variables: { bookId, memos: memos.flat() },
                });
            });
        }
    }, [bookId, commit, files]);

    return (
        <Form onSubmit={onSubmit}>
            <p>Import memos</p>
            <div className={style({ paddingBlock: "1em" })}>
                <FileInput
                    multiple
                    onFileChange={setFiles}
                    readOnly={isInFlight}
                />
            </div>
            <ControlGroup>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={files == null}>
                    Import
                </Button>
            </ControlGroup>
        </Form>
    );
};
