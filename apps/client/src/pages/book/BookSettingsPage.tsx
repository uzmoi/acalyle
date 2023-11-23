import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useId, useState } from "react";
import type { Scalars } from "~/__generated__/graphql";
import {
    bookHandleStore,
    changeBookHandle,
    changeBookTitle,
} from "~/store/book";
import { useBook } from "~/store/hook";
import { confirm } from "~/ui/modal";

const BookTitleForm: React.FC<{
    bookId: Scalars["ID"];
    currentTitle: string;
}> = ({ bookId, currentTitle }) => {
    const id = useId();
    const [title, setTitle] = useState(currentTitle);
    const onSubmit = () => {
        void changeBookTitle(bookId, title);
    };

    return (
        <Form onSubmit={onSubmit}>
            <label
                htmlFor={id}
                className={style({ fontSize: "0.75em", fontWeight: "bold" })}
            >
                Title
            </label>
            <br />
            <ControlGroup>
                <TextInput id={id} value={title} onValueChange={setTitle} />
                <Button type="submit">Change</Button>
            </ControlGroup>
        </Form>
    );
};

const BookHandleForm: React.FC<{
    bookId: Scalars["ID"];
    currentHandle: string | null;
}> = ({ bookId, currentHandle }) => {
    const id = useId();
    const [handle, setHandle] = useState(currentHandle ?? "");
    const handleLoader = useStore(bookHandleStore(handle));
    const onSubmit = async () => {
        const action = handle === "" ? "削除" : `「${handle}」に変更`;
        if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
            void changeBookHandle(bookId, handle === "" ? null : handle);
        }
    };

    const isValid =
        handle.length > 256 &&
        /^[\w-]+$/.test(handle) &&
        (handle === "" ||
            (handleLoader.status === "fulfilled" &&
                (handle === currentHandle || handleLoader.value == null)));
    const isChanged =
        handleLoader.status === "fulfilled" && handle !== (currentHandle ?? "");

    return (
        <Form onSubmit={() => void onSubmit()}>
            <label
                htmlFor={id}
                className={style({ fontSize: "0.75em", fontWeight: "bold" })}
            >
                Handle
            </label>
            <br />
            <ControlGroup>
                <TextInput
                    id={id}
                    value={handle}
                    onValueChange={setHandle}
                    aria-invalid={!isValid}
                />
                <Button type="submit" disabled={!isChanged}>
                    Change
                </Button>
            </ControlGroup>
        </Form>
    );
};

/** @package */
export const BookSettingsPage: React.FC<{
    book: string;
}> = ({ book: bookHandle }) => {
    const book = useBook(bookHandle);

    if (book == null) return null;

    return (
        <div>
            <BookTitleForm bookId={book.id} currentTitle={book.title} />
            <BookHandleForm bookId={book.id} currentHandle={book.handle} />
        </div>
    );
};
