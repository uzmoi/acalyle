import { assert } from "emnorst";
import { mkdir, writeFile } from "fs/promises";
import { pack, unpack } from "msgpackr";
import {
    list,
    mutationField,
    nonNull,
    nullable,
    objectType,
    queryField,
} from "nexus";
import path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
import { MemoTag } from "renderer/src/entities/tag/lib/memo-tag";
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringifyTag } from "renderer/src/entities/tag/lib/tag";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { MemoFilters, parseSearchQuery } from "./search";
import { createEscapeTag, pagination } from "./util";

const getBookThumbnailPath = (bookDataPath: string, bookId: string) => {
    const path = `${bookDataPath}/${bookId}.thumbnail`;
    return process.env.NODE_ENV === "development"
        ? `@fs${path}`
        : `file://${path}`;
};

const BookTitle = z.string().min(1).max(16);
const BookSetting = z.object({
    extentions: z.string().array(),
});

const BookSettingDefault = {
    extentions: [],
};

export const types = [
    objectType({
        name: "BookSetting",
        definition(t) {
            t.field("extentions", {
                type: list("String"),
            });
        },
    }),
    objectType({
        name: "Book",
        sourceType: { module: "@prisma/client", export: "Book" },
        definition(t) {
            t.implements("Node");
            t.string("title");
            t.string("thumbnail", {
                resolve(book, _, { bookDataPath }) {
                    return book.thumbnail === "#image"
                        ? getBookThumbnailPath(bookDataPath, book.id)
                        : book.thumbnail;
                },
            });
            t.dateTime("createdAt");
            t.field("settings", {
                type: "BookSetting",
                resolve(book) {
                    try {
                        return BookSetting.parse(
                            unpack(book.settings) as unknown,
                        );
                    } catch (e) {
                        return BookSettingDefault;
                    }
                },
            });
            t.field("memo", {
                type: nullable("Memo"),
                args: { id: nonNull("ID") },
                async resolve(book, args, { prisma }) {
                    const memo = await prisma.memo.findUnique({
                        where: { id: args.id },
                    });
                    if (memo == null || memo.bookId !== book.id) {
                        return null;
                    }
                    return memo;
                },
            });
            t.connectionField("memos", {
                type: "Memo",
                cursorFromNode: node => node.id,
                additionalArgs: {
                    search: "String",
                },
                nodes(book, args, { prisma }) {
                    const p = pagination(args);
                    let filters: MemoFilters | undefined;
                    if (args.search != null) {
                        filters = parseSearchQuery(args.search);
                    }
                    const tagWhere = (memoTag: MemoTag) => ({
                        type: memoTag.type,
                        name: memoTag.getName(),
                    });
                    return prisma.memo.findMany({
                        cursor: p.cursor != null ? { id: p.cursor } : undefined,
                        skip: p.cursor != null ? 1 : 0,
                        take: p.take,
                        orderBy: { createdAt: "desc" },
                        where: {
                            bookId: book.id,
                            // prettier-ignore
                            AND: filters && [
                                ...filters.contents.include.map(searchString => ({
                                    contains: searchString,
                                })),
                                ...filters.contents.exclude.map(searchString => ({
                                    not: { contains: searchString },
                                })),
                            ].map(contents => ({ contents })),
                            tags: filters?.tags.to((include, exclude) => ({
                                // prettier-ignore
                                some: include && {
                                    Tag: { AND: include.map(tagWhere) },
                                },
                                // prettier-ignore
                                none: exclude && {
                                    Tag: { OR: exclude.map(tagWhere) },
                                },
                            })),
                        },
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
        },
    }),
    queryField("book", {
        type: nullable("Book"),
        args: { id: nonNull("ID") },
        resolve(_, args, { prisma }) {
            return prisma.book.findUnique({
                where: { id: args.id },
            });
        },
    }),
    queryField(t => {
        t.connectionField("books", {
            type: "Book",
            cursorFromNode: node => node.id,
            nodes(_, args, { prisma }) {
                const p = pagination(args);
                return prisma.book.findMany({
                    cursor: p.cursor != null ? { id: p.cursor } : undefined,
                    skip: p.cursor != null ? 1 : 0,
                    take: p.take,
                    orderBy: { createdAt: "desc" },
                });
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
        async resolve(_, args, { prisma }) {
            const validBookTitle = await BookTitle.parseAsync(args.title);
            return prisma.book.create({
                data: {
                    title: validBookTitle,
                    thumbnail: `color:hsl(${Math.random() * 360}deg,80%,40%)`,
                    id: uuidv4(),
                    createdAt: new Date(),
                    settings: pack(BookSettingDefault),
                },
            });
        },
    }),
    mutationField("updateBookTitle", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            title: "String",
        },
        resolve(_, args, { prisma }) {
            const title = BookTitle.safeParse(args.title);
            return prisma.book.update({
                where: { id: args.id },
                data: { title: title.success ? title.data : undefined },
            });
        },
    }),
    mutationField("updateBookThumbnail", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            if (args.thumbnail != null) {
                await mkdir(bookDataPath, { recursive: true });
                const thumbnailPath = path.join(
                    bookDataPath,
                    `${args.id}.thumbnail`,
                );
                await writeFile(
                    thumbnailPath,
                    new Int8Array(args.thumbnail.buffer),
                );
            }
            return prisma.book.update({
                where: { id: args.id },
                data: {
                    thumbnail: args.thumbnail ? "#image" : undefined,
                },
            });
        },
    }),
    mutationField("deleteBook", {
        type: "ID",
        args: { id: nonNull("ID") },
        async resolve(_, args, { prisma }) {
            await prisma.book.delete({
                where: { id: args.id },
                select: {},
            });
            return args.id;
        },
    }),
    mutationField("renameTag", {
        type: nonNull("String"),
        args: {
            bookId: nonNull("ID"),
            old: nonNull("String"),
            new: nonNull("String"),
        },
        async resolve(_, args, { prisma }) {
            // "\x02" == Start of text
            const STX = "\x02";
            await prisma.$transaction([
                prisma.$executeRaw`
                    UPDATE Tag
                    SET name = ${args.new}
                    WHERE Tag.bookId = ${args.bookId} AND Tag.name = ${args.old}
                ;`,
                prisma.$executeRaw`
                    UPDATE Tag
                    SET name = REPLACE(
                        ${STX} || Tag.name,
                        ${STX + args.old + "/"},
                        ${args.new + "/"},
                    )
                    WHERE Tag.bookId = ${args.bookId}
                    AND Tag.name GLOB ${sqlGlob`${args.old}/*`}
                ;`,
            ]);
            return "";
        },
    }),
];

// const sqlPattern = createEscapeTag<string>(string => string.replace(/[%_]/g, "\\$&"));
const sqlGlob = createEscapeTag<string>(string =>
    string.replace(/[[\]*?]/g, "[$&]"),
);
