import { Book, Memo } from "@prisma/client";
import { assert } from "emnorst";
import { mkdir, writeFile } from "fs/promises";
import {
    connectionPlugin,
    interfaceType,
    list,
    makeSchema,
    mutationField,
    nonNull,
    nullable,
    objectType,
    queryField,
} from "nexus";
import path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
import { parseTag, stringifyTag } from "renderer/src/entities/book/tag";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Upload } from "./scalar";

const Node = interfaceType({
    name: "Node",
    definition(t) {
        t.id("id");
    }
});

interface PaginationArgs {
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
}

const pagination = (args: PaginationArgs) => {
    let cursor: string | null | undefined;
    let take: number | undefined;
    if(args.first != null) {
        // forward pagination
        cursor = args.after;
        take = args.first + 1;
    } else if(args.last != null) {
        // backward pagination
        cursor = args.before;
        take = -(args.last + 1);
    }
    return { cursor, take };
};

const Book = objectType({
    name: "Book",
    definition(t) {
        t.implements(Node);
        t.string("title");
        t.string("thumbnail");
        t.string("createdAt", { description: "ISO8601" });
        t.field("memo", {
            type: Memo,
            args: { id: nonNull("ID") },
            async resolve(book, args, { prisma }) {
                const memo = await prisma.memo.findUnique({
                    where: { id: args.id },
                });
                if(memo == null || memo.bookId !== book.id) {
                    throw "memo not found";
                }
                return gqlMemo(memo);
            },
        });
        t.connectionField("memos", {
            type: Memo,
            cursorFromNode: node => node.id,
            async nodes(book, args, { prisma }) {
                const p = pagination(args);
                const nodes = await prisma.memo.findMany({
                    cursor: p.cursor != null ? { id: p.cursor } : undefined,
                    skip: p.cursor != null ? 1 : 0,
                    take: p.take,
                    orderBy: { createdAt: "desc" },
                    where: { bookId: book.id },
                });
                return nodes.map(gqlMemo);
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
});

const Memo = objectType({
    name: "Memo",
    definition(t) {
        t.implements(Node);
        t.string("createdAt", { description: "ISO8601" });
        t.string("updatedAt", { description: "ISO8601" });
        t.string("contents");
        t.list.string("tags", {
            async resolve(memo, __, { prisma }) {
                const memoTags = await prisma.memoTag.findMany({
                    where: { memoId: memo.id },
                    select: { tag: true, args: true },
                });
                return memoTags.map(memoTag => {
                    assert.as<"normal" | "control">(memoTag.tag.type);
                    return stringifyTag({
                        type: memoTag.tag.type,
                        name: memoTag.tag.name,
                        args: memoTag.args,
                    });
                });
            },
        });
    }
});

const gqlMemo = (memo: Memo) => ({
    ...memo,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.updatedAt.toISOString(),
});

const gqlBook = (book: Book, bookDataPath: string) => ({
    ...book,
    thumbnail: book.thumbnail === "#image"
        ? process.env.NODE_ENV === "development"
            ? `@fs${bookDataPath}/${book.id}.thumbnail`
            : `file://${bookDataPath}/${book.id}.thumbnail`
        : book.thumbnail,
    createdAt: book.createdAt.toISOString(),
});

const Query = [
    queryField("data", { type: "String", resolve: () => "Hello nexus" }),
    queryField("node", {
        type: nullable(Node),
        args: { id: nonNull("ID") },
    }),
    queryField("book", {
        type: nullable(Book),
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
            type: Book,
            cursorFromNode: node => node.id,
            async nodes(_, args, { prisma, bookDataPath }) {
                let cursor: string | null | undefined;
                let take: number | undefined;
                if(args.first != null) {
                    // forward pagination
                    cursor = args.after;
                    take = args.first + 1;
                } else if(args.last != null) {
                    // backward pagination
                    cursor = args.before;
                    take = -(args.last + 1);
                }
                const nodes = await prisma.book.findMany({
                    cursor: cursor != null ? { id: cursor } : undefined,
                    skip: cursor != null ? 1 : 0,
                    take,
                    orderBy: { createdAt: "desc" },
                });
                return nodes.map(book => gqlBook(book, bookDataPath));
            },
            totalCount(_, __, { prisma }) {
                return prisma.book.count();
            },
        });
    }),
];

const BookTitle = z.string().min(1).max(16);

// for relay directive
const MemoWrapper = objectType({
    name: "MemoWrapper",
    definition(t) {
        t.field("node", { type: Memo });
    },
});

const Mutation = [
    mutationField("createBook", {
        type: Book,
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
    mutationField("editBook", {
        type: Book,
        args: {
            id: nonNull("ID"),
            title: "String",
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const title = BookTitle.safeParse(args.title);
            const book = await prisma.book.update({
                where: { id: args.id },
                data: {
                    title: title.success ? title.data : undefined,
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
    mutationField("createMemo", {
        type: MemoWrapper,
        args: { bookId: nonNull("ID") },
        async resolve(_, args, { prisma }) {
            const memo = await prisma.memo.create({
                data: {
                    id: uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    contents: "",
                    bookId: args.bookId,
                },
            });
            return { node: gqlMemo(memo) };
        }
    }),
    mutationField("editMemo", {
        type: MemoWrapper,
        args: {
            bookId: nonNull("ID"),
            memoId: nonNull("ID"),
            contents: "String",
            tags: list(nonNull("String")),
        },
        async resolve(_, args, { prisma }) {
            const updateMemo = prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    contents: args.contents ?? undefined,
                    updatedAt: new Date(),
                },
            });
            if(args.tags == null) {
                return { node: gqlMemo(await updateMemo) };
            }
            const tags = args.tags.slice(0, 32).map(parseTag)
                .filter(<T>(value: T): value is NonNullable<T> => value != null);
            const memoTags = await prisma.memoTag.findMany({
                where: { memoId: args.memoId },
                include: { tag: true },
            });
            const upserts = tags
                .filter(tag => {
                    return memoTags.some(memoTag => memoTag.tag.type !== tag.type);
                })
                .map(tag => prisma.memoTag.upsert({
                    where: {
                        memoId_tagName: {
                            memoId: args.memoId,
                            tagName: tag.name,
                        },
                    },
                    create: {
                        tag: {
                            connectOrCreate: {
                                where: { name: tag.name },
                                create: {
                                    type: tag.type,
                                    name: tag.name,
                                    bookId: args.bookId,
                                },
                            },
                        },
                        Memo: {
                            connect: { id: args.memoId },
                        },
                        args: tag.args,
                    },
                    update: {
                        args: { set: tag.args },
                    },
                }));
            const [memo] = await prisma.$transaction([
                updateMemo,
                ...upserts,
                prisma.memoTag.deleteMany({
                    where: {
                        OR: memoTags.filter(memoTag => {
                            return tags.every(tag => memoTag.tagName !== tag.name);
                        }),
                    },
                }),
            ]);
            return { node: gqlMemo(memo) };
        }
    }),
];

export const graphQLSchema = makeSchema({
    types: [Upload, ...Query, ...Mutation],
    plugins: [
        connectionPlugin({
            extendConnection: {
                totalCount: { type: nonNull("Int") },
            },
        }),
    ],
    nonNullDefaults: { output: true },
    outputs: {
        schema: path.join(__dirname, "../data/schema.graphql"),
        typegen: path.join(__dirname, "../main/src/__generated__/nexus.ts"),
    },
    contextType: {
        module: path.join(__dirname, "../main/src/context.ts"),
        export: "Context",
    },
    features: {
        abstractTypeStrategies: {
            __typename: true,
        },
    },
});
