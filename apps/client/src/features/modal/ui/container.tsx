import { ModalContainer } from "@acalyle/ui";
import { type ModalInput, type Modals, modal } from "../model";
import { ConfirmForm } from "./confirm";

type ModalRenderers = {
  [P in keyof Modals]: Modals[P] extends (input: infer I) => infer O ?
    (input: I, close: (output: O) => void) => React.ReactNode
  : never;
};

const modals: ModalRenderers = {
  confirm({ message }, close) {
    return <ConfirmForm message={message} close={close} />;
  },
};

const renderModal = (data: ModalInput): React.ReactNode => {
  return modals[data.type](data.input, result => {
    void data.close(result as never);
  });
};

export const QuickModalContainer: React.FC = () => {
  return <ModalContainer modal={modal} render={renderModal} size="content" />;
};
