import path = require("path");
import { createContext } from "./gql-schema/context";
import { listen } from "./server";

const serve = (userDataPath: string) => {
    const bookDataPath = path.join(userDataPath, "bookdata");
    const context = createContext(bookDataPath);
    return listen(context);
};

const close = serve(process.argv.at(-1) ?? "");

process.on("exit", () => {
    close();
});
