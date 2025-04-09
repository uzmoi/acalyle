import { cx, style } from "@acalyle/css";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { useEffect } from "react";
import { center } from "../base/style-utilities";
import { useTransitionStatus } from "../base/use-transition-status";
import { vars } from "../theme";
import { TRANSITION_DURATION, type Modal } from "./modal";

export type ModalSize = "content" | "max";

export interface ModalContainerProps<T> {
  modal: Modal<T, unknown>;
  render: (data: T) => React.ReactNode;
  size?: ModalSize;
  className?: string;
  onClickBackdrop?: React.MouseEventHandler<HTMLDivElement>;
}

const transition = (): Promise<void> => timeout(TRANSITION_DURATION);

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

  const data = useStore(modal.data);

  const status = useTransitionStatus({ show: !!data?.show, transition });

  return (
    <div
      data-open={status.startsWith("enter")}
      data-status={status}
      className={cx(
        style({
          position: "fixed",
          inset: 0,
          zIndex: vars.zIndex.modal,
          backgroundColor: "#0008",
          backdropFilter: "blur(0.0625em)",
          transition: `opacity ${TRANSITION_DURATION}ms`,
          '&[data-open="false"]': {
            opacity: 0,
          },
          '&[data-status="exited"]': {
            visibility: "hidden",
          },
        }),
        className,
      )}
      onClick={handleClickBackdrop}
    >
      {data ?
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
          {render(data.data)}
        </div>
      : null}
    </div>
  );
};
