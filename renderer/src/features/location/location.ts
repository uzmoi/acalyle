import {
    atom,
    atomFamily,
    useRecoilTransaction_UNSTABLE,
    useRecoilValue,
} from "recoil";
import { RootEl } from "~/app/root-el";
import { consoleEffect, sessionStorageEffect } from "~/shared/recoil-effects";

const Location = atom({
    key: "Location",
    default: "books",
    effects: [sessionStorageEffect(), consoleEffect("location: %s")],
});

const LocationState = atomFamily<{ scroll: number }, string>({
    key: "LocationState",
    default: { scroll: 0 },
    effects: [
        sessionStorageEffect({
            encode(value) {
                return String(value.scroll);
            },
            decode(item) {
                return { scroll: Number(item) };
            },
        }),
    ],
});

export const useLocation = () => {
    const location = useRecoilValue(Location);
    const state = useRecoilValue(LocationState(location));
    return { ...state, location };
};

export const useNavigate = () => {
    return useRecoilTransaction_UNSTABLE(
        ({ get, set }) =>
            (to: string) => {
                // save LocationState
                const rootEl = get(RootEl);
                const scroll = rootEl?.scrollTop ?? 0;
                const location = get(Location);
                set(LocationState(location), { scroll });

                // navigate
                set(Location, to);
            },
        [],
    );
};
