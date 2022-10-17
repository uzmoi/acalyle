import { css } from "@linaria/core";
import { graphql, useMutation } from "react-relay";
import { Button } from "~/shared/control";
import { useNavigate } from "~/shared/router/react";
import { deleteMutation } from "./__generated__/deleteMutation.graphql";

export const BookDeleteForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [commitDelete, isInFlight] = useMutation<deleteMutation>(graphql`
        mutation deleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    const navigate = useNavigate();

    const deleteBook = () => {
        commitDelete({
            variables: { id: bookId },
            onCompleted() {
                navigate("books");
            },
        });
    };

    return (
        <form className={BookDeleteFormStyle}>
            <Button onClick={deleteBook} disabled={isInFlight}>
                delete book
            </Button>
        </form>
    );
};

const BookDeleteFormStyle = css`
    font-size: 0.9em;
`;
