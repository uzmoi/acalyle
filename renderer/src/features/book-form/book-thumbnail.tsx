import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, FileInput, Form } from "~/shared/control";
import { bookThumbnailChangeMutation } from "./__generated__/bookThumbnailChangeMutation.graphql";

export const BookThumbnailForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [file, setFile] = useState<File | null>(null);

    // prettier-ignore
    const [commitChangeThumbnail, isInFlight] = useMutation<bookThumbnailChangeMutation>(graphql`
        mutation bookThumbnailChangeMutation($id: ID!, $thumbnail: Upload!) {
            updateBookThumbnail(id: $id, thumbnail: $thumbnail) {
                thumbnail
            }
        }
    `);
    const handleSubmit = () => {
        if (file == null) return;
        commitChangeThumbnail({
            variables: { id: bookId, thumbnail: null },
            uploadables: { "variables.thumbnail": file },
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
            <Button type="submit" disabled={file == null || isInFlight}>
                Submit
            </Button>
        </Form>
    );
};
