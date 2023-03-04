import type { AtomEffect } from "recoil";

export const consoleEffect =
    (string = "%o"): AtomEffect<string> =>
    ({ onSet }) => {
        onSet(value => {
            console.log(string, value);
        });
    };
