import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "~/shared/control";
import { bookThumbnailChangeMutation } from "./__generated__/bookThumbnailChangeMutation.graphql";

export const BookThumbnail: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [file, setFile] = useState<File | null>(null);

    const [commitChangeThumbnail, isInFlight] = useMutation<bookThumbnailChangeMutation>(graphql`
    mutation bookThumbnailChangeMutation($id: ID!, $thumbnail: Upload!) {
        editBook(id: $id, thumbnail: $thumbnail) {
            thumbnail
        }
    }
    `);
    const handleSubmit = () => {
        if(file == null) return;
        commitChangeThumbnail({
            variables: { id: bookId, thumbnail: null },
            uploadables: { "variables.thumbnail": file },
        });
    };
    const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = e => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setFile(e.target.files![0]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChangeFile} />
            <Button disabled={file == null || isInFlight}>
                Submit
            </Button>
        </form>
    );
};
