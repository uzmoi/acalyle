import * as Router from "@acalyle/router";
import { useStore } from "@nanostores/react";
import { Suspense } from "react";
import { Location } from "~/store/location";
import { BookRoute } from "./routes";

export const PageRoot: React.FC = () => {
    const location = useStore(Location);

    return <Suspense>{Router.match(BookRoute, location as never)}</Suspense>;
};
