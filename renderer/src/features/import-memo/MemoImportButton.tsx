import { css, cx } from "@linaria/core";
import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import { FileInput } from "~/shared/control";
import {
    ControlPartOutlineStyle,
    ControlPartResetStyle,
} from "~/shared/control/base";
import { MemoImportButtonMutation } from "./__generated__/MemoImportButtonMutation.graphql";
import { fileToMemoInput } from "./from-file";

export const MemoImportButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [commit, isInFlight] = useMutation<MemoImportButtonMutation>(graphql`
        mutation MemoImportButtonMutation($bookId: ID!, $memos: [MemoInput!]!) {
            importMemos(bookId: $bookId, memos: $memos)
        }
    `);

    const onFileChange = useCallback(
        (files: FileList) => {
            void Promise.all([...files].map(fileToMemoInput)).then(memos => {
                commit({
                    variables: { bookId, memos: memos.flat() },
                });
            });
        },
        [bookId, commit],
    );

    return (
        <label
            className={cx(
                ControlPartResetStyle,
                ControlPartOutlineStyle,
                css`
                    display: inline-block;
                    font-weight: bold;
                `,
            )}
        >
            Import memos
            <FileInput
                multiple
                onFileChange={onFileChange}
                readOnly={isInFlight}
                className={HiddenStyle}
            />
        </label>
    );
};

const HiddenStyle = css`
    width: 1px;
    height: 1px;
    visibility: hidden;
`;
