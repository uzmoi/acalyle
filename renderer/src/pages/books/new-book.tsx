import { Button, Form, TextInput } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useId, useState } from "react";
import { graphql, useMutation } from "react-relay";
import {
    BookThumbnailFormBlock,
    type BookThumbnailState,
} from "~/features/book-thumbnail";
import { useNavigate } from "~/features/location";
import { cropImage } from "~/shared/cropper";
import { link } from "../link";
import type { newBookMutation } from "./__generated__/newBookMutation.graphql";

export const NewBookPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [cropState, setCropState] = useState<BookThumbnailState>({
        file: null,
        x: 0,
        y: 0,
        scale: 1,
        bgColor: "#888888",
    });

    const [commit, isInFlight] = useMutation<newBookMutation>(graphql`
        mutation newBookMutation(
            $title: String!
            $description: String!
            $thumbnail: Upload
        ) {
            createBook(
                title: $title
                description: $description
                thumbnail: $thumbnail
            ) {
                id
            }
        }
    `);

    const navigate = useNavigate();
    const onSubmit = () => {
        void (async () => {
            const fileUrl =
                cropState.file && URL.createObjectURL(cropState.file);
            const blob =
                (fileUrl &&
                    (await cropImage(
                        fileUrl,
                        { width: 512, height: 512 },
                        cropState,
                        cropState.bgColor,
                    ))) ||
                undefined;
            commit({
                variables: { title, description, thumbnail: null },
                uploadables: blob && {
                    "variables.thumbnail": blob,
                },
                onCompleted({ createBook }) {
                    navigate(link("books/:bookId", { bookId: createBook.id }));
                },
            });
        })();
    };

    const htmlId = useId();
    const titleId = `${htmlId}-title`;
    const descriptionId = `${htmlId}-description`;
    const thumbnailId = `${htmlId}-thumbnail`;

    return (
        <main
            className={css`
                padding: 2em;
            `}
        >
            <Form onSubmit={onSubmit}>
                <h1>Create a new book</h1>
                <dl>
                    <dt className={DTStyle}>
                        <label htmlFor={titleId} className={LabelStyle}>
                            Book title (required)
                        </label>
                    </dt>
                    <dd>
                        <TextInput
                            id={titleId}
                            className={css`
                                width: 100%;
                                min-width: 16em;
                                max-width: 32em;
                            `}
                            value={title}
                            onValueChange={setTitle}
                            required
                            maxLength={32}
                            disabled={isInFlight}
                        />
                    </dd>
                    <dt className={DTStyle}>
                        <label htmlFor={descriptionId} className={LabelStyle}>
                            Description
                        </label>
                    </dt>
                    <dd>
                        <TextInput
                            id={descriptionId}
                            className={css`
                                width: 100%;
                                min-width: 16em;
                            `}
                            value={description}
                            onValueChange={setDescription}
                            maxLength={500}
                            disabled={isInFlight}
                        />
                    </dd>
                    <dt className={DTStyle}>
                        <label htmlFor={thumbnailId} className={LabelStyle}>
                            Thumbnail
                        </label>
                    </dt>
                    <dd>
                        <BookThumbnailFormBlock
                            cropState={cropState}
                            setCropState={setCropState}
                        />
                    </dd>
                </dl>
                <Button
                    type="submit"
                    disabled={isInFlight}
                    className={css`
                        margin-top: 1em;
                    `}
                >
                    Create book
                </Button>
            </Form>
        </main>
    );
};

const DTStyle = css`
    margin-top: 1em;
    margin-bottom: 0.25em;
`;

const LabelStyle = css`
    font-size: 0.9em;
    font-weight: bold;
`;
