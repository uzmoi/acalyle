import { css } from "@linaria/core";
import { useMemo, useState } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { Button, Form } from "~/shared/control";
import { cropImage } from "~/shared/cropper";
import { BookThumbnailFormBlock } from "./BookThumbnailFormBlock";
import { BookThumbnailFormMutation } from "./__generated__/BookThumbnailFormMutation.graphql";
import { BookThumbnailFormQuery } from "./__generated__/BookThumbnailFormQuery.graphql";

export const BookThumbnailForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const { book } = useLazyLoadQuery<BookThumbnailFormQuery>(
        graphql`
            query BookThumbnailFormQuery($bookId: ID!) {
                book(id: $bookId) {
                    thumbnail
                }
            }
        `,
        { bookId },
    );

    const [file, setFile] = useState<File | null>(null);
    const fileUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : book?.thumbnail),
        [file, book?.thumbnail],
    );

    // prettier-ignore
    const [commitChangeThumbnail, isInFlight] = useMutation<BookThumbnailFormMutation>(graphql`
        mutation BookThumbnailFormMutation($id: ID!, $thumbnail: Upload!) {
            updateBookThumbnail(id: $id, thumbnail: $thumbnail) {
                thumbnail
            }
        }
    `);

    const [bgColor, setBgColor] = useState<string>("#888888");
    const [cropState, setCropState] = useState({ x: 0, y: 0, scale: 1 });

    const handleSubmit = () => {
        if (fileUrl == null) return;
        void cropImage(
            fileUrl,
            { width: 512, height: 512 },
            cropState,
            bgColor,
        ).then(blob => {
            commitChangeThumbnail({
                variables: { id: bookId, thumbnail: null },
                // cspell:ignore uploadables
                uploadables: { "variables.thumbnail": blob },
            });
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3
                className={css`
                    margin-bottom: 0.6em;
                `}
            >
                Thumbnail
            </h3>
            <BookThumbnailFormBlock
                file={file}
                fileUrl={fileUrl}
                setFile={setFile}
                cropState={cropState}
                setCropState={setCropState}
                bgColor={bgColor}
                setBgColor={setBgColor}
            >
                <Button
                    type="submit"
                    className={css`
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    `}
                    disabled={file == null || isInFlight}
                >
                    Submit
                </Button>
            </BookThumbnailFormBlock>
        </Form>
    );
};
