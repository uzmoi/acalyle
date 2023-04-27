import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { BiRefresh } from "react-icons/bi";
import { bookConnection, bookConnectionQuery } from "~/store/book-connection";

const refetchBookConnection = () => {
    void bookConnection.refetch();
};

export const BookSearchBar: React.FC<{
    className?: string;
}> = ({ className }) => {
    const query = useStore(bookConnectionQuery);

    return (
        <Form onSubmit={refetchBookConnection} className={className}>
            <ControlGroup className={style({ display: "flex" })}>
                <TextInput
                    type="search"
                    className={style({ flex: "1 1" })}
                    placeholder="Find a book"
                    value={query}
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    onValueChange={bookConnectionQuery.set}
                />
                <Button
                    type="submit"
                    aria-label="Refresh"
                    className={style({
                        padding: "0.25em",
                        fontSize: "1.25em",
                        lineHeight: 1,
                    })}
                >
                    <BiRefresh />
                </Button>
            </ControlGroup>
        </Form>
    );
};
