import { Button, FileInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useRef } from "react";
import { BiUpload } from "react-icons/bi";
import { graphql, useMutation } from "react-relay";
import type { UploadResourceButtonMutation } from "./__generated__/UploadResourceButtonMutation.graphql";

export const UploadResourceButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [commit, isInFlight] =
        useMutation<UploadResourceButtonMutation>(graphql`
            mutation UploadResourceButtonMutation(
                $bookId: ID!
                $fileName: String!
                $file: Upload!
            ) {
                uploadResource(
                    bookId: $bookId
                    fileName: $fileName
                    file: $file
                )
            }
        `);

    const onSelect = useCallback(
        (file: File) => {
            commit({
                variables: {
                    bookId,
                    fileName: file.name,
                    file: null,
                },
                // cspell:word uploadables
                uploadables: {
                    "variables.file": file,
                },
            });
        },
        [bookId, commit],
    );

    const fileInputEl = useRef<HTMLInputElement>(null);

    const onClick = useCallback(() => {
        fileInputEl.current?.click();
    }, []);

    return (
        <Button onClick={onClick} disabled={isInFlight}>
            <BiUpload className={style({ verticalAlign: "bottom" })} />
            <span className={style({ marginLeft: "0.5em" })}>
                Upload resource
            </span>
            <FileInput
                _ref={fileInputEl}
                className={style({ display: "none" })}
                onFileChange={onSelect}
            />
        </Button>
    );
};
