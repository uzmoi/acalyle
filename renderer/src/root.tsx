import { StrictMode, useEffect, useState, VFC } from "react";
import { acalyle } from "./acalyle";

const Cwd: VFC = () => {
    const [cwd, setCwd] = useState("");

    useEffect(() => {
        acalyle.cwd().then(setCwd);
    }, []);

    return <p>{cwd}</p>;
};

export const root = (
    <StrictMode>
        <Cwd />
    </StrictMode>
);
