import { Modal } from "@acalyle/ui";

export interface Modals {
  confirm(input: { message: string }): boolean;
}

export type ModalInput = {
  [P in keyof Modals]: Modals[P] extends (input: infer I) => infer O ?
    { type: P; input: I; close: (output: O) => Promise<void> }
  : never;
}[keyof Modals];

export const modal = /* #__PURE__ */ Modal.create<ModalInput, unknown>();

export const openModal = <T extends keyof Modals>(
  type: T,
  input: Modals[T] extends (input: infer I) => unknown ? I : never,
): Promise<ReturnType<Modals[T]>> => {
  return modal.open({
    type,
    input,
    async close(output: unknown) {
      await modal.close(output as never);
    },
  } as ModalInput) as Promise<ReturnType<Modals[T]>>;
};
