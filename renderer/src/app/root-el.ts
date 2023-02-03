import { atom } from "recoil";

export const RootEl = atom<HTMLDivElement | null>({
    key: "RootEl",
    default: null,
});
