import { style } from "@acalyle/css";
import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { useId, useState } from "react";
import type { ID } from "~/__generated__/graphql";
import { bookHandleStore } from "~/book/store/book";
import { useBook } from "~/store/hook";
import { confirm } from "~/ui/modal";

const BookTitleForm: React.FC<{
    bookId: ID;
    currentTitle: string;
}> = ({ bookId, currentTitle }) => {
    const id = useId();
    const [title, setTitle] = useState(currentTitle);
    const onSubmit = () => {
        // void changeBookTitle(bookId, title);
    };

    const length = title.length;
    const isValid = 0 < length && length <= 256;
    const isChanged = title !== currentTitle;

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
                <TextInput
                    id={id}
                    value={title}
                    onValueChange={setTitle}
                    required
                    aria-invalid={isChanged && !isValid}
                />
                <Button type="submit" disabled={!(isChanged && isValid)}>
                    Change
                </Button>
            </ControlGroup>
        </Form>
    );
};

const isValidBookHandle = (handle: string): boolean => {
    const length = handle.length;
    return 0 < length && length <= 256 && /^[\w-]+$/.test(handle);
};

const useBookHandleForm = (currentHandle: string | null) => {
    const [handle, setHandle] = useState(currentHandle ?? "");
    const handleLoader = useStore(bookHandleStore(handle));

    const isAvailable =
        isValidBookHandle(handle) &&
        handleLoader.status === "fulfilled" &&
        handleLoader.value == null;

    const isChanged = handle !== (currentHandle ?? "");

    return {
        handle,
        setHandle,
        isAvailable,
        isChanged,
    };
};

const BookHandleForm: React.FC<{
    bookId: ID;
    currentHandle: string | null;
}> = ({ bookId, currentHandle }) => {
    const id = useId();
    const { handle, setHandle, isAvailable, isChanged } =
        useBookHandleForm(currentHandle);

    const onSubmit = async () => {
        const action = handle === "" ? "削除" : `「${handle}」に変更`;
        if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
            // void changeBookHandle(bookId, handle === "" ? null : handle);
        }
    };

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
                    minLength={1}
                    aria-invalid={isChanged && !(handle === "" || isAvailable)}
                />
                <Button
                    type="submit"
                    disabled={!(isChanged && (handle === "" || isAvailable))}
                >
                    Change
                </Button>
            </ControlGroup>
        </Form>
    );
};

const BookDescriptionForm: React.FC<{
    bookId: ID;
    currentDescription: string;
}> = ({ bookId, currentDescription }) => {
    const id = useId();
    const [description, setDescription] = useState(currentDescription);
    const onSubmit = () => {
        // void changeBookDescription(bookId, description);
    };

    const isValid = description.length <= 1024;
    const isChanged = description !== currentDescription;

    return (
        <Form onSubmit={onSubmit}>
            <label
                htmlFor={id}
                className={style({ fontSize: "0.75em", fontWeight: "bold" })}
            >
                Description
            </label>
            <br />
            <ControlGroup>
                <TextInput
                    id={id}
                    value={description}
                    onValueChange={setDescription}
                    aria-invalid={isChanged && !isValid}
                />
                <Button type="submit" disabled={!(isChanged && isValid)}>
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
            <BookDescriptionForm
                bookId={book.id}
                currentDescription={book.description}
            />
        </div>
    );
};
