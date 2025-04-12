import { useStore } from "@nanostores/react";
import type { Modal } from "./modal";

export type State<TData> =
  | { type: "open"; data: TData }
  | { type: "close"; data: TData }
  | null;

export const useModalContainer = <TData, TResult>(
  modal: Modal<TData, TResult>,
): State<TData> => {
  const state = useStore(modal.data);

  return (
    state === undefined ? null
    : state.show ? { type: "open", data: state.data }
    : { type: "close", data: state.data }
  );
};
