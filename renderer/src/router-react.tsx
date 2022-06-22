import { createContext, useContext, useRef, useState } from "react";
import { Link, MatchParams, ParseStringPath, PathNomalize, Route, Routing } from "./router";

type AcaRoutePath = AcaRoute["route"]["path"];

const RouteContext = createContext<readonly [Link<AcaRoutePath>, Navigate<AcaRoutePath>]>(["" as Link<AcaRoutePath>, () => { /* - */ }]);

interface Navigate<T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): void;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): void;
}

export const RouteProvider = <T extends AcaRoutePath>({ routes, init }: {
    routes: Route<T, never, React.ReactNode>;
    init: Link<PathNomalize<T>>;
    children?: React.ReactNode;
}) => {
    const [location, setLocation] = useState<Link<PathNomalize<T>>>(init);
    const value = useRef<[Link<PathNomalize<T>>, Navigate<T>]>([
        location,
        (pattern, params = {} as never) => {
            const link = Route.link<Routing<T>>();
            setLocation(link(pattern as never, params as never));
        },
    ]).current;

    value[0] = location;

    return (
        <RouteContext.Provider value={value}>
            {routes.match(location as never)}
        </RouteContext.Provider>
    );
};

export const useLocation = () => useContext(RouteContext);
