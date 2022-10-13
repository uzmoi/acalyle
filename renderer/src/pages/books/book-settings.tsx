import { css } from "@linaria/core";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "~/shared/router/react";
import { bookSettingsDeleteMutation } from "./__generated__/bookSettingsDeleteMutation.graphql";

export const BookSettingsPage: React.FC<{
    id: string;
}> = ({ id }) => {
    const [commitDeleteBook, isInFlight] = useMutation<bookSettingsDeleteMutation>(graphql`
        mutation bookSettingsDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    const navigate = useNavigate();

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                navigate("books");
            },
        });
    };

    return (
        <div className={BookSettingsPageStyle}>
            <button onClick={deleteBook} disabled={isInFlight}>
                delete book
            </button>
        </div>
    );
};

const BookSettingsPageStyle = css`
    /* - */
`;
