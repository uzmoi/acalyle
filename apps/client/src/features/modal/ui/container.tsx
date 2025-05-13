import { cx, style } from "@acalyle/css";
import { center, ModalContainer } from "@acalyle/ui";
import { theme } from "~/theme";
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

const renderModal = (data: ModalInput): React.ReactNode => (
  <div
    className={cx(
      ":uno: rounded shadow-lg",
      style({ ...center(), backgroundColor: theme("app-bg") }),
    )}
  >
    {modals[data.type](data.input, result => {
      void data.close(result as never);
    })}
  </div>
);

export const QuickModalContainer: React.FC = () => {
  return <ModalContainer modal={modal} render={renderModal} />;
};
