import { clamp } from "emnorst";

export const contentsHeight = (contents: string) => {
    const contentsLines = contents.split("\n").length;
    return clamp(Math.floor(contentsLines / 8), 1, 4);
};
