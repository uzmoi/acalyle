import { css } from "@linaria/core";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "~/features/location";
import { link } from "~/pages/link";
import { Button, Form } from "~/shared/control";
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
                navigate(link("books"));
            },
        });
    };

    return (
        <Form className={BookDeleteFormStyle}>
            <Button type="submit" onClick={deleteBook} disabled={isInFlight}>
                delete book
            </Button>
        </Form>
    );
};

const BookDeleteFormStyle = css`
    font-size: 0.9em;
`;
