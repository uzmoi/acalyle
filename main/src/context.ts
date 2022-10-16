import { PrismaClient } from "@prisma/client";
import path = require("path");

export const createContext = (app: Electron.App): Context => {
    const bookDataPath = path.join(app.getPath("userData"), "bookdata");
    return {
        prisma: new PrismaClient(),
        app,
        bookDataPath,
    };
};

export interface Context {
    prisma: PrismaClient;
    app: Electron.App;
    bookDataPath: string;
}
