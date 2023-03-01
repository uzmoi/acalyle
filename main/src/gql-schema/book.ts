import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { nonNullable } from "emnorst";
import { mkdir } from "fs/promises";
import { pack, unpack } from "msgpackr";
import {
    arg,
    enumType,
    mutationField,
    nonNull,
    nullable,
    objectType,
    queryField,
} from "nexus";
import path = require("path");
import { z } from "zod";
import {
    getBookThumbnailPath,
    getThumbnailRef,
    resolveBookThumbnail,
    types as thumbnailTypes,
} from "./book-thumbnail";
import { MemoFilters, parseSearchQuery } from "./search";
import { pagination } from "./util";

export { thumbnailTypes };

const BookTitle = z.string().min(1).max(16);
const BookSettingType = z.object({
    extensions: z.string().array(),
});

const BookSettingDefault = {
    extensions: [],
};

export const BookSetting = objectType({
    name: "BookSetting",
    definition(t) {
        t.list.string("extensions");
    },
});

export const Book = objectType({
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
                    return BookSettingType.parse(
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
                            some: include && {
                                AND: include.map(tag => ({
                                    symbol: tag.symbol,
                                })),
                            },
                            none: exclude && {
                                OR: exclude.map(tag => ({
                                    symbol: tag.symbol,
                                })),
                            },
                        })) satisfies Prisma.TagListRelationFilter | undefined,
                    } satisfies Prisma.MemoWhereInput,
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
                    where: { Memo: { bookId: book.id } },
                    distinct: "symbol",
                    select: { symbol: true },
                });
                return tags.map(tag => tag.symbol);
            },
        });
        t.list.string("tagProps", {
            args: {
                name: nonNull("String"),
            },
            async resolve(book, args, { prisma }) {
                const tags = await prisma.tag.findMany({
                    where: {
                        Memo: { bookId: book.id },
                        symbol: `@${args.name}`,
                    },
                    distinct: "prop",
                    select: { prop: true },
                });
                return tags.map(tag => tag.prop).filter(nonNullable);
            },
        });
    },
});

export const book = queryField("book", {
    type: nullable("Book"),
    args: { id: nonNull("ID") },
    resolve(_, args, { prisma }) {
        return prisma.book.findUnique({
            where: { id: args.id },
        });
    },
});

export const SortOrder = enumType({
    name: "SortOrder",
    members: ["asc", "desc"],
});

export const BookSortOrder = enumType({
    name: "BookSortOrder",
    members: ["Created", "Title", "LastUpdated"],
});

export const books = queryField(t => {
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
});

export const createBook = mutationField("createBook", {
    type: "Book",
    args: {
        title: nonNull("String"),
        description: "String",
        thumbnail: "Upload",
    },
    async resolve(_, args, { prisma, bookDataPath }) {
        const createdAt = new Date();
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
                createdAt,
                updatedAt: createdAt,
                settings: pack(BookSettingDefault),
            } satisfies Prisma.BookCreateInput,
        });
    },
});

export const updateBookTitle = mutationField("updateBookTitle", {
    type: "Book",
    args: {
        id: nonNull("ID"),
        title: "String",
    },
    resolve(_, args, { prisma }) {
        const title = BookTitle.safeParse(args.title);
        return prisma.book.update({
            where: { id: args.id },
            data: {
                title: title.success ? title.data : undefined,
                updatedAt: new Date(),
            },
        });
    },
});

export const deleteBook = mutationField("deleteBook", {
    type: "ID",
    args: { id: nonNull("ID") },
    async resolve(_, args, { prisma }) {
        await prisma.book.delete({
            where: { id: args.id },
            select: null,
        });
        return args.id;
    },
});
