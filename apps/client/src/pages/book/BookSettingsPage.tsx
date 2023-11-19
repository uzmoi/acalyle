import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useBook } from "~/store/hook";
import { changeBookTitle } from "~/store/book";
import type { Scalars } from "../../__generated__/graphql";
import { useId, useState } from "react";
import { style } from "@macaron-css/core";

const BookTitleForm: React.FC<{
    bookId: Scalars["ID"];
    currentTitle: string;
}> = ({ bookId, currentTitle }) => {
    const id = useId();
    const [title, setTitle] = useState(currentTitle);
    const onSubmit = () => {
        changeBookTitle(bookId, title);
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

/** @package */
export const BookSettingsPage: React.FC<{
    book: string;
}> = ({ book: bookHandle }) => {
    const book = useBook(bookHandle);

    if (book == null) return null;

    return (
        <div>
            <BookTitleForm bookId={book.id} currentTitle={book.title} />
        </div>
    );
};
