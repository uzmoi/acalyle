import { useRecoilValue } from "recoil";
import { prefersColorScheme } from "./prefers-color-scheme";

export const useColorScheme = () => {
    return useRecoilValue(prefersColorScheme);
};
