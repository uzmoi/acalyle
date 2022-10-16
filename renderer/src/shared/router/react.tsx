import { css, cx } from "@linaria/core";
import { useCallback } from "react";
import { AtomEffect, atom, useRecoilValue, useSetRecoilState } from "recoil";
import { MatchParams, ParseStringPath, link } from "./router";

type AcaRoutePath = AcaRoute["route"]["path"];

interface Navigate<T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): void;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): void;
}

const hashLocationEffect: AtomEffect<string> = ({ setSelf, onSet }) => {
    const change = () => {
        setSelf(window.location.hash.slice(1));
    };
    change();
    window.addEventListener("hashchange", change);
    onSet(hash => {
        location.hash = hash;
    });
};

const LocationState = atom<string>({
    key: "Location",
    effects: [hashLocationEffect],
});

export const useNavigate = (): Navigate<AcaRoutePath> => {
    const setLocation = useSetRecoilState(LocationState);
    return useCallback((pattern, params?) => {
        setLocation(link()(pattern, params as never));
    }, [setLocation]);
};

export const useLocation = () => useRecoilValue(LocationState);

export const Link = <T extends AcaRoutePath>(props: (
    { pattern: T }
    & (T extends `${string}/:${string}` | `:${string}`
        ? { params: MatchParams<ParseStringPath<T>> }
        : { params?: undefined }
    )
    & Omit<React.ComponentPropsWithoutRef<"a">, "href">
)): React.ReactElement => {
    const { pattern, params, className, ...rest } = props;
    const navigate = useNavigate();

    return (
        <a
            {...rest}
            className={cx(LinkStyle, className)}
            href={"#" + link()(pattern, params as never)}
            onClick={e => {
                if(e.defaultPrevented) return;
                e.preventDefault();
                navigate(pattern, params as never);
            }}
        />
    );
};

const LinkStyle = css`
    color: inherit;
    text-decoration: none;
`;
