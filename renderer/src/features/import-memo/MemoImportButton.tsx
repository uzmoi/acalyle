import { Button } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useState } from "react";
import { Modal } from "~/shared/base";
import { MemoImportForm } from "./MemoImportForm";

export const MemoImportButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={css`
                display: inline-block;
                font-weight: bold;
            `}
        >
            <Button onClick={() => setIsOpen(true)}>Import memos</Button>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className={css`
                    padding: 4em;
                `}
            >
                <div
                    className={css`
                        padding: 1em;
                        background-color: black;
                    `}
                >
                    <MemoImportForm
                        bookId={bookId}
                        onCancel={() => setIsOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
};
