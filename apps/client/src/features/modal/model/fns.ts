import { openModal } from "./store";

export const confirm = (message: string): Promise<boolean> =>
  openModal("confirm", { message });
