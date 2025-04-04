import { style } from "@acalyle/css";
import {
    Button,
    ControlGroup,
    Form,
    List,
    Modal,
    ModalContainer,
} from "@acalyle/ui";
import { useCallback, useState } from "react";
import { $bookConnection, type BookId, BookOverview } from "~/entities/book";
import type { ID } from "~/lib/graphql";
import { useConnection } from "~/shared/graphql";
import { BookSearchBar } from "~/ui/BookSearchBar";

const modal = /* #__PURE__ */ Modal.create<void, ID | undefined>();

export const selectBook = () => {
    return modal.open();
};

export const renderSelectBookModal = () => (
    <ModalContainer
        modal={modal}
        size="max"
        render={() => (
            <div
                className={style({
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                    padding: "1.25em",
                    height: "100%",
                })}
            >
                <BookSearchBar />
                <BookSelectForm
                    onSubmit={() => {
                        void modal.close();
                    }}
                />
            </div>
        )}
    />
);

const BookSelectForm: React.FC<{
    query?: string;
    onSubmit?: (bookId?: ID | null) => void;
}> = ({ query = "", onSubmit }) => {
    const [selectedBookId, setBookId] = useState<ID | null>(null);
    const { nodeIds } = useConnection($bookConnection(query));

    const handleSubmit = useCallback(() => {
        onSubmit?.(selectedBookId);
    }, [onSubmit, selectedBookId]);

    const cancel = useCallback(() => {
        onSubmit?.();
    }, [onSubmit]);

    return (
        <Form
            onSubmit={handleSubmit}
            className={style({
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                height: "100%",
            })}
        >
            <List
                className={style({
                    flex: "1 1 0",
                    overflowY: "auto",
                })}
            >
                {nodeIds.map(bookId => (
                    <List.Item
                        key={bookId}
                        data-selected={bookId === selectedBookId}
                        // HACK: BookOverviewのイベントを無理やりもぎ取ってる
                        onClickCapture={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBookId(bookId);
                        }}
                        className={style({
                            '&[data-selected="true"]': {
                                outline: "1px solid red",
                            },
                        })}
                    >
                        <BookOverview bookId={bookId as string as BookId} />
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
