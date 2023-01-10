import { css, cx } from "@linaria/core";
import { useCallback } from "react";
import { AtomEffect, atom, useRecoilValue, useSetRecoilState } from "recoil";
import { MatchParamKeyOf, MatchParams, WithSearchParams, link } from ".";

type AcaRoutePath = AcaRoute["route"]["path"];

interface Navigate<T extends string> {
    <U extends T>(pattern: U, params: MatchParams<MatchParamKeyOf<U>>): void;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<MatchParamKeyOf<U>>]
            : []
    ): void;
}

const sessionStorageEffect =
    (key: string, defaultValue = ""): AtomEffect<string> =>
    ({ setSelf, onSet }) => {
        setSelf(sessionStorage.getItem(key) ?? defaultValue);
        onSet(value => {
            sessionStorage.setItem(key, value);
        });
    };

const consoleEffect =
    (string = "%o"): AtomEffect<string> =>
    ({ onSet }) => {
        onSet(value => {
            console.log(string, value);
        });
    };

const LocationState = atom<string>({
    key: "Location",
    effects: [sessionStorageEffect("location"), consoleEffect("location: %s")],
});

export const useNavigate = (): Navigate<WithSearchParams<AcaRoutePath>> => {
    const setLocation = useSetRecoilState(LocationState);
    return useCallback(
        (pattern, params?) => {
            setLocation(link()(pattern, params as never));
        },
        [setLocation],
    );
};

export const useLocation = () => useRecoilValue(LocationState);

export const Link: React.FC<
    {
        to: string;
    } & Omit<React.ComponentPropsWithoutRef<"a">, "href">
> = ({ to, className, ...rest }) => {
    const setLocation = useSetRecoilState(LocationState);

    return (
        <a
            {...rest}
            className={cx(LinkStyle, className)}
            href={to}
            onClick={e => {
                if (e.defaultPrevented) return;
                e.preventDefault();
                setLocation(to);
            }}
        />
    );
};

const LinkStyle = css`
    color: inherit;
    text-decoration: none;
`;
