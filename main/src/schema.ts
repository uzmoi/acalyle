import { Book, Memo } from "@prisma/client";
import {
    connectionPlugin,
    interfaceType,
    makeSchema,
    mutationField,
    nonNull,
    nullable,
    objectType,
    queryField,
} from "nexus";
import path = require("path");
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

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
    }
});

const Memo = objectType({
    name: "Memo",
    definition(t) {
        t.implements(Node);
        t.string("createdAt", { description: "ISO8601" });
        t.string("updatedAt", { description: "ISO8601" });
        t.list.string("contents");
    }
});

const gqlMemo = (memo: Memo) => ({
    ...memo,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.createdAt.toISOString(),
    contents: memo.contents.split(","),
});

const gqlBook = (book: Book) => ({
    ...book,
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
        async resolve(_, args, { prisma }) {
            const book = await prisma.book.findUnique({
                where: { id: args.id },
            });
            return book && gqlBook(book);
        }
    }),
    queryField(t => {
        t.connectionField("books", {
            type: Book,
            cursorFromNode: node => node.id,
            async nodes(_, args, { prisma }) {
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
                return nodes.map(gqlBook);
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
        async resolve(_, args, { prisma }) {
            const validBookTitle = await BookTitle.parseAsync(args.title);
            const book = await prisma.book.create({
                data: {
                    title: validBookTitle,
                    id: uuidv4(),
                    createdAt: new Date(),
                },
            });
            return gqlBook(book);
        }
    }),
    mutationField("editBook", {
        type: Book,
        args: {
            id: nonNull("ID"),
            title: "String",
        },
        async resolve(_, args, { prisma }) {
            const title = BookTitle.safeParse(args.title);
            const book = await prisma.book.update({
                where: { id: args.id },
                data: {
                    title: title.success ? title.data : undefined,
                },
            });
            return gqlBook(book);
        }
    }),
    mutationField("deleteBook", {
        type: "ID",
        args: { id: nonNull("ID") },
        async resolve(_, args, { prisma }) {
            return (await prisma.book.delete({ where: { id: args.id } })).id;
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
        },
        async resolve(_, args, { prisma }) {
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    contents: args.contents ?? undefined,
                    updatedAt: new Date(),
                },
            });
            return { node: gqlMemo(memo) };
        }
    }),
];

export const graphQLSchema = makeSchema({
    types: [...Query, ...Mutation],
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
