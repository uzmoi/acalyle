import { Button, Modal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useState } from "react";
import { MemoImportForm } from "./MemoImportForm";

export const MemoImportButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style({ display: "inline-block", fontWeight: "bold" })}>
            <Button onClick={() => setIsOpen(true)}>Import memos</Button>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className={style({ padding: "4em" })}
            >
                <div
                    className={style({
                        padding: "1em",
                        backgroundColor: "black",
                    })}
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
