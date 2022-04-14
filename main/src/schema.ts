import { Book } from "@prisma/client";
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

const Book = objectType({
    name: "Book",
    definition(t) {
        t.implements(Node);
        t.string("title");
        t.string("createdAt");
    }
});

const gqlBook = (book: Book) => ({
    ...book,
    createdAt: book.createdAt.toISOString(),
});

const Query = [
    queryField("data", { type: "String", resolve: () => "Hello nexus" }),
    queryField("book", {
        type: nullable(Book),
        args: { id: "ID" },
        async resolve(_, args, { prisma }) {
            const book = await prisma.book.findUnique({
                where: { id: args.id ?? undefined },
            });
            return book && gqlBook(book);
        }
    }),
    queryField(t => {
        t.connectionField("books", {
            type: Book,
            cursorFromNode: node => node.id,
            async nodes(_, args, { prisma }) {
                const nodes = await prisma.book.findMany({
                    cursor: args.before || args.after ? { id: args.before || args.after || undefined } : undefined,
                    skip: args.before || args.after ? 1 : 0,
                    take: (args.first ?? args.last ?? 0) + 1,
                    orderBy: { createdAt: "desc" },
                });
                return nodes.map(gqlBook);
            }
        });
    }),
];

const BookTitle = z.string().min(1).max(16);

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
];

export const graphQLSchema = makeSchema({
    types: [...Query, ...Mutation],
    plugins: [
        connectionPlugin(),
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
