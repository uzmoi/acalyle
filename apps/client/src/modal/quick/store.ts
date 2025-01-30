import { Modal } from "@acalyle/ui";

export interface QuickModals {
    confirm(input: { message: string }): boolean;
}

export type QuickModalInput = {
    [P in keyof QuickModals]: QuickModals[P] extends (
        (input: infer I) => infer O
    ) ?
        { type: P; input: I; close: (output: O) => Promise<void> }
    :   never;
}[keyof QuickModals];

export const quickModal = /* #__PURE__ */ Modal.create<
    QuickModalInput,
    unknown
>();

export const openQuickModal = <T extends keyof QuickModals>(
    type: T,
    input: QuickModals[T] extends (input: infer I) => unknown ? I : never,
): Promise<ReturnType<QuickModals[T]>> => {
    return quickModal.open({
        type,
        input,
        async close(output: unknown) {
            await quickModal.close(output as never);
        },
    } as QuickModalInput) as Promise<ReturnType<QuickModals[T]>>;
};
