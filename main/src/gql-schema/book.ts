import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { mkdir } from "fs/promises";
import { pack, unpack } from "msgpackr";
import {
    arg,
    enumType,
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
import { z } from "zod";
import {
    getBookThumbnailPath,
    getThumbnailRef,
    resolveBookThumbnail,
    types as thumbnailTypes,
} from "./book-thumbnail";
import { MemoFilters, parseSearchQuery } from "./search";
import { createEscapeTag, pagination } from "./util";

const BookTitle = z.string().min(1).max(16);
const BookSetting = z.object({
    extensions: z.string().array(),
});

const BookSettingDefault = {
    extensions: [],
};

export const types = [
    ...thumbnailTypes,
    objectType({
        name: "BookSetting",
        definition(t) {
            t.field("extensions", {
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
            t.string("description");
            t.string("thumbnail", {
                resolve(book, _, { bookDataPath }) {
                    return resolveBookThumbnail(
                        book.thumbnail,
                        bookDataPath,
                        book.id,
                    );
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
                // FIXME ここがnullableな必要ある？
                cursorFromNode: node => node?.id ?? "",
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
                        cursor: p.cursor == null ? undefined : { id: p.cursor },
                        skip: p.cursor == null ? 0 : 1,
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
                        where: { bookId: book.id },
                    });
                },
            });
            t.list.string("tags", {
                async resolve(book, __, { prisma }) {
                    const tags = await prisma.tag.findMany({
                        where: { bookId: book.id },
                    });
                    return tags.map(tag => {
                        return MemoTag.from(
                            tag.type as "normal" | "control",
                            [tag.name],
                            [],
                        ).toString();
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
    enumType({
        name: "SortOrder",
        members: ["asc", "desc"],
    }),
    enumType({
        name: "BookSortOrder",
        members: ["Created", "Title", "LastUpdated"],
    }),
    queryField(t => {
        t.connectionField("books", {
            type: "Book",
            additionalArgs: {
                query: arg({ type: "String" }),
                order: arg({ type: "SortOrder" }),
                orderBy: arg({ type: "BookSortOrder" }),
            },
            // FIXME ここがnullableな必要ある？
            cursorFromNode: node => node?.id ?? "",
            nodes(_, args, { prisma }) {
                const p = pagination(args);
                const order: "asc" | "desc" = args.order ?? "desc";
                const orderBy = {
                    Title: "title",
                    Created: "createdAt",
                    LastUpdated: "updatedAt",
                }[args.orderBy ?? "Created"];
                const filter: Prisma.StringFilter | undefined = args.query
                    ? { contains: args.query }
                    : undefined;
                return prisma.book.findMany({
                    cursor: p.cursor == null ? undefined : { id: p.cursor },
                    skip: p.cursor == null ? 0 : 1,
                    take: p.take,
                    orderBy: { [orderBy]: order },
                    where:
                        filter &&
                        ({
                            OR: [{ title: filter }, { description: filter }],
                        } satisfies Prisma.BookWhereInput),
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
            description: "String",
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const validBookTitle = await BookTitle.parseAsync(args.title);
            const bookId = randomUUID();
            await mkdir(path.join(bookDataPath, bookId), { recursive: true });
            const thumbnailPath = getBookThumbnailPath(bookDataPath, bookId);
            const thumbnailRef = await getThumbnailRef(
                thumbnailPath,
                args.thumbnail,
            );
            return prisma.book.create({
                data: {
                    id: bookId,
                    title: validBookTitle,
                    description: args.description ?? "",
                    thumbnail: thumbnailRef,
                    createdAt: new Date(),
                    settings: pack(BookSettingDefault),
                } satisfies Prisma.BookCreateInput,
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
