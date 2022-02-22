import "vite/client";
import { Acalyle } from "../../main/src/ipc";

declare global {
    const acalyle: Acalyle;
}
