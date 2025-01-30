import { ModalContainer } from "@acalyle/ui";
import { ConfirmForm } from "./confirm";
import { type QuickModalInput, type QuickModals, quickModal } from "./store";

type QuickModalRenderers = {
    [P in keyof QuickModals]: QuickModals[P] extends (
        (input: infer I) => infer O
    ) ?
        (input: I, close: (output: O) => void) => React.ReactNode
    :   never;
};

const modals: QuickModalRenderers = {
    confirm({ message }, close) {
        return <ConfirmForm message={message} close={close} />;
    },
};

const renderQuickModal = (data: QuickModalInput) => {
    return modals[data.type](data.input, result => {
        void data.close(result as never);
    });
};

export const QuickModalContainer: React.FC = () => {
    return (
        <ModalContainer
            modal={quickModal}
            render={renderQuickModal}
            size="content"
        />
    );
};
