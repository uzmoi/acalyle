import { PrismaClient } from "@prisma/client";

export const createContext = (bookDataPath: string): Context => {
    return {
        prisma: new PrismaClient(),
        bookDataPath,
    };
};

export interface Context {
    prisma: PrismaClient;
    bookDataPath: string;
}
