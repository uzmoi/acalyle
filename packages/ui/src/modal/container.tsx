import { cx, style } from "@acalyle/css";
import { useEffect } from "react";
import { center } from "../base/style-utilities";
import { vars } from "../theme";
import { useModalContainer } from "./hook";
import type { Modal } from "./modal";

export type ModalSize = "content" | "max";

export interface ModalContainerProps<T> {
  modal: Modal<T, unknown>;
  render: (data: NoInfer<T>) => React.ReactNode;
  size?: ModalSize;
  className?: string;
  onClickBackdrop?: React.MouseEventHandler<HTMLDivElement>;
}

const TRANSITION_DURATION = 200;

export const ModalContainer = <T,>({
  modal,
  render,
  size,
  className,
  onClickBackdrop,
}: ModalContainerProps<T>): React.ReactElement | null => {
  const handleClickBackdrop = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    onClickBackdrop?.(e);
    if (e.defaultPrevented) return;
    void modal.close();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        void modal.close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.addEventListener("keydown", onKeyDown);
    };
  }, [modal]);

  const [state, status] = useModalContainer(modal);

  return (
    <div
      data-modal-status={status}
      className={cx(
        style({
          position: "fixed",
          inset: 0,
          backgroundColor: "#0008",
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
      {state && (
        <div
          className={cx(
            style({
              ...center(),
              maxWidth: "min(calc(100vw - min(8em, 20%)), 72em)",
              maxHeight: "calc(100dvh - 4em)",
              backgroundColor: vars.color.bg.layout,
              borderRadius: vars.radius.layout,
              boxShadow: "0 0 2em #111",
            }),
            size === "max" && style({ width: "100%", height: "100%" }),
          )}
        >
          {render(state.data)}
        </div>
      )}
    </div>
  );
};
