import baseX = require("base-x");
import { nonNullable } from "emnorst";
import { mutationField, nonNull } from "nexus";
import * as fs from "node:fs/promises";
import path = require("node:path");

const base36 = baseX("0123456789abcdefghijklmnopqrstuvwxyz");

export const resources = async (
    bookDataPath: string,
    bookId: string,
): Promise<string[]> => {
    const fileNames = await fs.readdir(path.join(bookDataPath, bookId));
    return fileNames
        .map(base36FileName => base36.decodeUnsafe(base36FileName))
        .filter(nonNullable)
        .map(fileNameArray =>
            String.fromCharCode(...new Uint16Array(fileNameArray.buffer)),
        );
};

export const uploadResourceMutation = mutationField("uploadResource", {
    type: nonNull("String"),
    args: {
        bookId: nonNull("ID"),
        fileName: nonNull("String"),
        file: "Upload",
    },
    async resolve(_, args, { prisma, bookDataPath }) {
        await prisma.book.findUniqueOrThrow({
            where: { id: args.bookId },
            select: null,
        });
        const fileNameArray = Uint16Array.from(args.fileName, char =>
            char.charCodeAt(0),
        );
        const base36FileName = base36.encode(
            new Uint8Array(fileNameArray.buffer),
        );
        const resourcePath = path.join(
            bookDataPath,
            args.bookId,
            base36FileName,
        );
        if (args.file == null) {
            await fs.rm(resourcePath);
        } else {
            await fs.writeFile(resourcePath, new Uint8Array(args.file.buffer));
        }
        return "";
    },
});
