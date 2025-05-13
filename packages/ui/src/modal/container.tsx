import { cx, style } from "@acalyle/css";
import { theme } from "../theme";
import { useModalContainer } from "./hook";
import type { Modal } from "./modal";

export interface ModalContainerProps<T> {
  modal: Modal<T, unknown>;
  render: (data: NoInfer<T>) => React.ReactNode;
  className?: string;
  onClickBackdrop?: React.MouseEventHandler<HTMLDivElement>;
}

const TRANSITION_DURATION = 200;

export const ModalContainer = <T,>({
  modal,
  render,
  className,
  onClickBackdrop,
}: ModalContainerProps<T>): React.ReactElement | null => {
  const handleClickBackdrop = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    onClickBackdrop?.(e);
    if (e.defaultPrevented) return;
    void modal.close();
  };

  const [state, status] = useModalContainer(modal);

  return (
    <div
      data-modal-status={status}
      className={cx(
        style({
          position: "fixed",
          inset: 0,
          background: theme("modal-backdrop"),
          backdropFilter: "blur(1px)",
          transition: `opacity ${TRANSITION_DURATION}ms`,
          opacity: 0,
          '&[data-modal-status="open"]': {
            opacity: 1,
          },
          '&[data-modal-status="closed"]': {
            visibility: "hidden",
          },
        }),
        className,
      )}
      data-testid="modal_backdrop"
      onClick={handleClickBackdrop}
    >
      {state && render(state.data)}
    </div>
  );
};
