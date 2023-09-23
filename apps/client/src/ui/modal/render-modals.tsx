import { renderConfirmModal } from "./confirm";
import { renderSelectBookModal } from "./select-book";

export const renderModals = () => (
    <>
        {renderConfirmModal()}
        {renderSelectBookModal()}
    </>
);
