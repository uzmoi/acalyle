import { renderConfirmModal } from "./confirm";
import { renderNoteModal } from "./note";
import { renderSelectBookModal } from "./select-book";

export const renderModals = () => (
    <>
        {renderNoteModal()}
        {renderConfirmModal()}
        {renderSelectBookModal()}
    </>
);
