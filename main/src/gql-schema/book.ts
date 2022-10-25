import { Book } from "@prisma/client";
import { assert } from "emnorst";
import { mkdir, writeFile } from "fs/promises";
import { mutationField, nonNull, nullable, objectType, queryField } from "nexus";
import path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringifyTag } from "renderer/src/entities/tag/lib/tag";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Node, pagination } from "./util";

export const gqlBook = (book: Book, bookDataPath: string) => ({
    ...book,
    thumbnail: book.thumbnail === "#image"
        ? process.env.NODE_ENV === "development"
            ? `@fs${bookDataPath}/${book.id}.thumbnail`
            : `file://${bookDataPath}/${book.id}.thumbnail`
        : book.thumbnail,
});

const BookTitle = z.string().min(1).max(16);

export const types = [
    objectType({
        name: "Book",
        definition(t) {
            t.implements(Node);
            t.string("title");
            t.string("thumbnail");
            t.dateTime("createdAt");
            t.field("memo", {
                type: nullable("Memo"),
                args: { id: nonNull("ID") },
                async resolve(book, args, { prisma }) {
                    const memo = await prisma.memo.findUnique({
                        where: { id: args.id },
                    });
                    if(memo == null || memo.bookId !== book.id) {
                        return null;
                    }
                    return memo;
                },
            });
            t.connectionField("memos", {
                type: "Memo",
                cursorFromNode: node => node.id,
                nodes(book, args, { prisma }) {
                    const p = pagination(args);
                    return prisma.memo.findMany({
                        cursor: p.cursor != null ? { id: p.cursor } : undefined,
                        skip: p.cursor != null ? 1 : 0,
                        take: p.take,
                        orderBy: { createdAt: "desc" },
                        where: { bookId: book.id },
                    });
                },
                totalCount(book, __, { prisma }) {
                    return prisma.memo.count({
                        where: { id: book.id },
                    });
                },
            });
            t.list.string("tags", {
                async resolve(book, __, { prisma }) {
                    const tags = await prisma.tag.findMany({
                        where: { bookId: book.id },
                    });
                    return tags.map(tag => {
                        assert.as<"normal" | "control">(tag.type);
                        return stringifyTag({
                            type: tag.type,
                            name: tag.name,
                            args: null,
                        });
                    });
                },
            });
        }
    }),
    queryField("book", {
        type: nullable("Book"),
        args: { id: nonNull("ID") },
        async resolve(_, args, { prisma, bookDataPath }) {
            const book = await prisma.book.findUnique({
                where: { id: args.id },
            });
            return book && gqlBook(book, bookDataPath);
        }
    }),
    queryField(t => {
        t.connectionField("books", {
            type: "Book",
            cursorFromNode: node => node.id,
            async nodes(_, args, { prisma, bookDataPath }) {
                const p = pagination(args);
                const nodes = await prisma.book.findMany({
                    cursor: p.cursor != null ? { id: p.cursor } : undefined,
                    skip: p.cursor != null ? 1 : 0,
                    take: p.take,
                    orderBy: { createdAt: "desc" },
                });
                return nodes.map(book => gqlBook(book, bookDataPath));
            },
            totalCount(_, __, { prisma }) {
                return prisma.book.count();
            },
        });
    }),
    mutationField("createBook", {
        type: "Book",
        args: {
            title: nonNull("String"),
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const validBookTitle = await BookTitle.parseAsync(args.title);
            const book = await prisma.book.create({
                data: {
                    title: validBookTitle,
                    thumbnail: `color:hsl(${Math.random() * 360}deg,80%,40%)`,
                    id: uuidv4(),
                    createdAt: new Date(),
                },
            });
            return gqlBook(book, bookDataPath);
        }
    }),
    mutationField("updateBookTitle", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            title: "String",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const title = BookTitle.safeParse(args.title);
            const book = await prisma.book.update({
                where: { id: args.id },
                data: { title: title.success ? title.data : undefined },
            });
            return gqlBook(book, bookDataPath);
        }
    }),
    mutationField("updateBookThumbnail", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const book = await prisma.book.update({
                where: { id: args.id },
                data: {
                    thumbnail: args.thumbnail ? "#image" : undefined,
                },
            });
            if(args.thumbnail != null) {
                await mkdir(bookDataPath, { recursive: true });
                const thumbnailPath = path.join(bookDataPath, `${args.id}.thumbnail`);
                await writeFile(thumbnailPath, new Int8Array(args.thumbnail.buffer));
            }
            return gqlBook(book, bookDataPath);
        }
    }),
    mutationField("deleteBook", {
        type: "ID",
        args: { id: nonNull("ID") },
        async resolve(_, args, { prisma }) {
            const deletedBook = await prisma.book.delete({
                where: { id: args.id },
                select: { id: true },
            });
            return deletedBook.id;
        }
    }),
];
