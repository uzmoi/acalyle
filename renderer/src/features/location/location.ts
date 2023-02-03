import { atom, useRecoilCallback, useRecoilValue } from "recoil";
import { consoleEffect, sessionStorageEffect } from "~/shared/recoil-effects";

const Location = atom({
    key: "Location",
    default: "books",
    effects: [sessionStorageEffect(), consoleEffect("location: %s")],
});

export const useLocation = () => useRecoilValue(Location);

export const useNavigate = () => {
    return useRecoilCallback(
        ({ set }) =>
            (to: string) => {
                set(Location, to);
            },
        [],
    );
};
