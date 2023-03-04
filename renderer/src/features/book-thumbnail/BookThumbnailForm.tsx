import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { Button, Form } from "~/shared/control";
import { cropImage } from "~/shared/cropper";
import {
    BookThumbnailFormBlock,
    type BookThumbnailState,
} from "./BookThumbnailFormBlock";
import type { BookThumbnailFormMutation } from "./__generated__/BookThumbnailFormMutation.graphql";
import type { BookThumbnailFormQuery } from "./__generated__/BookThumbnailFormQuery.graphql";

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

    // prettier-ignore
    const [commitChangeThumbnail, isInFlight] = useMutation<BookThumbnailFormMutation>(graphql`
        mutation BookThumbnailFormMutation($id: ID!, $thumbnail: Upload!) {
            updateBookThumbnail(id: $id, thumbnail: $thumbnail) {
                thumbnail
            }
        }
    `);

    const [cropState, setCropState] = useState<BookThumbnailState>({
        file: null,
        x: 0,
        y: 0,
        scale: 1,
        bgColor: "#888888",
    });

    const handleSubmit = () => {
        const fileUrl = cropState.file && URL.createObjectURL(cropState.file);
        if (fileUrl == null) return;
        void cropImage(
            fileUrl,
            { width: 512, height: 512 },
            cropState,
            cropState.bgColor,
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
                cropState={cropState}
                setCropState={setCropState}
                fallbackThumbnail={book?.thumbnail}
            >
                <Button
                    type="submit"
                    className={css`
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    `}
                    disabled={cropState.file == null || isInFlight}
                >
                    Submit
                </Button>
            </BookThumbnailFormBlock>
        </Form>
    );
};
