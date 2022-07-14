import { useSyncExternalStore } from "react";
import { MatchParams, ParseStringPath, Route } from "./router";

type AcaRoutePath = AcaRoute["route"]["path"];

interface Navigate<T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): void;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): void;
}

export const useHashLocation = () => useSyncExternalStore(
    onStoreChange => {
        window.addEventListener("hashchange", onStoreChange);
        return () => {
            window.removeEventListener("hashchange", onStoreChange);
        };
    },
    () => window.location.hash.slice(1),
);

export const hashNavigate: Navigate<AcaRoutePath> = (pattern, params?) => {
    window.location.hash = Route.link()(pattern, params as never);
};

export const Link = <T extends AcaRoutePath>(props: (
    { pattern: T }
    & (T extends `${string}/:${string}` | `:${string}`
        ? { params: MatchParams<ParseStringPath<T>> }
        : { params?: undefined }
    )
    & Omit<React.ComponentPropsWithoutRef<"a">, "href">
)): React.ReactElement => {
    const { pattern, params, ...rest } = props;

    return (
        <a
            {...rest}
            href={Route.link()(pattern, params as never)}
            onClick={() => {
                hashNavigate(pattern, params as never);
            }}
        />
    );
};
