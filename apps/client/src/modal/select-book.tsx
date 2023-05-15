import { Button, Form, openModal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback } from "react";

export const selectBook = () => {
    return openModal<string | null>({
        default: null,
        render: close => (
            <div className={style({ padding: "1.25em" })}>
                <BookSelectForm onSubmit={close} />
            </div>
        ),
    });
};

const BookSelectForm: React.FC<{
    onSubmit?: (bookId?: string | null) => void;
}> = ({ onSubmit }) => {
    const cancel = useCallback(() => {
        onSubmit?.();
    }, [onSubmit]);

    return (
        <Form>
            <Button onClick={cancel}>Cancel</Button>
        </Form>
    );
};
