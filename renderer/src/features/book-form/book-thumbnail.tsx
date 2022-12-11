import { css } from "@linaria/core";
import { useMemo, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, FileInput, Form, TextInput } from "~/shared/control";
import { Cropper, cropImage } from "~/shared/cropper";
import { bookThumbnailChangeMutation } from "./__generated__/bookThumbnailChangeMutation.graphql";

export const BookThumbnailForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [file, setFile] = useState<File | null>(null);
    const fileUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : undefined),
        [file],
    );

    // prettier-ignore
    const [commitChangeThumbnail, isInFlight] = useMutation<bookThumbnailChangeMutation>(graphql`
        mutation bookThumbnailChangeMutation($id: ID!, $thumbnail: Upload!) {
            updateBookThumbnail(id: $id, thumbnail: $thumbnail) {
                thumbnail
            }
        }
    `);

    const [bgColor, setBgColor] = useState<string>("#888888");
    const [cropState, setCropState] = useState({ x: 0, y: 0, scale: 1 });

    const handleSubmit = () => {
        if (fileUrl == null) return;
        void cropImage(fileUrl, cropState, bgColor).then(blob => {
            commitChangeThumbnail({
                variables: { id: bookId, thumbnail: null },
                uploadables: { "variables.thumbnail": blob },
            });
        });
    };

    const handleFileChange = (file: File | null) => {
        if (file != null) {
            setFile(file);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FileInput onFileChange={handleFileChange} accept="image/*" />
            <TextInput value={bgColor} onValueChange={setBgColor} />
            <p>{Math.floor(cropState.scale * 100)}%</p>
            <Cropper
                src={fileUrl}
                state={cropState}
                onChange={setCropState}
                className={CropperStyle}
                bgColor={bgColor}
            />
            <Button type="submit" disabled={file == null || isInFlight}>
                Submit
            </Button>
        </Form>
    );
};

const CropperStyle = css`
    width: 16em;
    height: 16em;
`;

