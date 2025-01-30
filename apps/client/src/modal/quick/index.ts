import { openQuickModal } from "./store";

export * from "./container";

export const confirm = (message: string): Promise<boolean> =>
    openQuickModal("confirm", { message });
