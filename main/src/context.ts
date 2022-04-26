import { PrismaClient } from "@prisma/client";

export const context: Context = {
    prisma: new PrismaClient(),
};

export interface Context {
    prisma: PrismaClient;
}
