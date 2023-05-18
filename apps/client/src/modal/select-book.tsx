import { Button, ControlGroup, Form, List, openModal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useCallback, useState } from "react";
import type { Scalars } from "~/__generated__/graphql";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "~/ui/BookOverview";
import { BookSearchBar } from "~/ui/BookSearchBar";

export const selectBook = () => {
    return openModal<Scalars["ID"] | null>({
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
    query?: string;
    onSubmit?: (bookId?: Scalars["ID"] | null) => void;
}> = ({ query = "", onSubmit }) => {
    const [selectedBookId, setBookId] = useState<Scalars["ID"] | null>(null);
    const { nodeIds } = useStore(bookConnection(query));

    const handleSubmit = useCallback(() => {
        onSubmit?.(selectedBookId);
    }, [onSubmit, selectedBookId]);

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
                {nodeIds.map(bookId => (
                    <List.Item
                        key={bookId}
                        data-selected={bookId === selectedBookId}
                        // HACK
                        onClickCapture={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBookId(bookId);
                        }}
                        className={style({
                            selectors: {
                                '&[data-selected="true"]': {
                                    outline: "1px solid red",
                                },
                            },
                        })}
                    >
                        <BookOverview bookId={bookId} />
                    </List.Item>
                ))}
            </List>
            <ControlGroup>
                <Button onClick={cancel}>Cancel</Button>
                <Button type="submit" disabled={selectedBookId == null}>
                    Submit
                </Button>
            </ControlGroup>
        </Form>
    );
};
