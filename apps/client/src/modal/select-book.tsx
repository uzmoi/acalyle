import { Button, ControlGroup, Form, List, openModal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useCallback, useState } from "react";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "~/ui/BookOverview";
import { BookSearchBar } from "~/ui/BookSearchBar";

export const selectBook = () => {
    return openModal<string | null>({
        default: null,
        render: close => (
            <div className={style({ padding: "1.25em" })}>
                <BookSearchBar className={style({ marginBottom: "1em" })} />
                <BookSelectForm onSubmit={close} />
            </div>
        ),
    });
};

const BookSelectForm: React.FC<{
    onSubmit?: (bookId?: string | null) => void;
}> = ({ onSubmit }) => {
    const [bookId, setBookId] = useState<string | null>(null);
    const { nodes } = useStore(bookConnection);

    const handleSubmit = useCallback(() => {
        onSubmit?.(bookId);
    }, [onSubmit, bookId]);

    const cancel = useCallback(() => {
        onSubmit?.();
    }, [onSubmit]);

    return (
        <Form onSubmit={handleSubmit}>
            <List
                className={style({
                    maxHeight: "32em",
                    overflowY: "auto",
                    marginBottom: "1em",
                })}
            >
                {nodes.map(book => (
                    <List.Item
                        key={book.id}
                        data-selected={book.id === bookId}
                        // HACK
                        onClickCapture={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBookId(book.id);
                        }}
                        className={style({
                            selectors: {
                                '&[data-selected="true"]': {
                                    outline: "1px solid red",
                                },
                            },
                        })}
                    >
                        <BookOverview book={book} />
                    </List.Item>
                ))}
            </List>
            <ControlGroup>
                <Button onClick={cancel}>Cancel</Button>
                <Button type="submit" disabled={bookId == null}>
                    Submit
                </Button>
            </ControlGroup>
        </Form>
    );
};
