import { AcalyleMemoTag, TagSymbol } from "@acalyle/core";
import { Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { nonNullable } from "emnorst";
import {
    inputObjectType,
    list,
    mutationField,
    nonNull,
    objectType,
} from "nexus";

const updateBook = (prisma: PrismaClient, bookId: string, updatedAt: Date) =>
    prisma.book.update({
        where: { id: bookId },
        data: { updatedAt },
        select: null,
    });

export const Memo = objectType({
    name: "Memo",
    sourceType: { module: "@prisma/client", export: "Memo" },
    definition(t) {
        t.implements("Node");
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
        t.string("contents");
        t.list.string("tags", {
            async resolve(memo, __, { prisma }) {
                const tags = await prisma.tag.findMany({
                    where: { memoId: memo.id },
                    select: { symbol: true, prop: true },
                });
                return tags.map(tag =>
                    new AcalyleMemoTag(
                        tag.symbol as TagSymbol,
                        tag.prop,
                    ).toString(),
                );
            },
        });
        t.field("book", {
            type: nonNull("Book"),
            async resolve(memo, __, { prisma }) {
                const { Book } = await prisma.memo.findUniqueOrThrow({
                    where: { id: memo.id },
                    select: { Book: true },
                });
                return Book;
            },
        });
    },
});

export const createMemo = mutationField("createMemo", {
    type: "Memo",
    args: {
        bookId: nonNull("ID"),
        template: "String",
    },
    async resolve(_, args, { prisma }) {
        const createdAt = new Date();

        type Template = {
            contents: string;
            tags: { symbol: string; prop: string | null }[];
        };
        let template: Template | undefined;
        if (args.template != null) {
            template = await prisma.memo.findFirstOrThrow({
                where: {
                    tags: {
                        some: { symbol: "@template", prop: args.template },
                    },
                },
                select: {
                    contents: true,
                    tags: {
                        select: { symbol: true, prop: true },
                    },
                },
            });
        }

        const [memo] = await prisma.$transaction([
            prisma.memo.create({
                data: {
                    id: randomUUID(),
                    createdAt,
                    updatedAt: createdAt,
                    contents: template?.contents ?? "",
                    tags: {
                        create: template?.tags.filter(
                            tag => tag.symbol !== "@template",
                        ),
                    },
                    bookId: args.bookId,
                },
            }),
            updateBook(prisma, args.bookId, createdAt),
        ]);
        return memo;
    },
});

export const removeMemo = mutationField("removeMemo", {
    type: nonNull(list(nonNull("ID"))),
    args: { ids: nonNull(list(nonNull("ID"))) },
    async resolve(_, args, { prisma }) {
        const memoWhereInput: Prisma.MemoWhereInput = {
            id: { in: args.ids },
        };
        await prisma.$transaction([
            prisma.memo.deleteMany({
                where: memoWhereInput,
            }),
            prisma.book.updateMany({
                where: {
                    memos: { some: memoWhereInput },
                },
                data: { updatedAt: new Date() },
            }),
        ]);
        return args.ids;
    },
});

export const updateMemoContents = mutationField("updateMemoContents", {
    type: "Memo",
    args: {
        memoId: nonNull("ID"),
        contents: nonNull("String"),
    },
    resolve(_, args, { prisma }) {
        const updatedAt = new Date();
        return prisma.memo.update({
            where: { id: args.memoId },
            data: {
                contents: args.contents ?? undefined,
                updatedAt,
                Book: { update: { updatedAt } },
            },
        });
    },
});

export const MemoInput = inputObjectType({
    name: "MemoInput",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("contents");
        t.nonNull.list.nonNull.string("tags");
        t.nonNull.dateTime("createdAt");
        t.nonNull.dateTime("updatedAt");
    },
});

const joinJoin = (values: readonly unknown[][]) =>
    Prisma.join(values.map(values => Prisma.join(values, ",", "(", ")")));

export const importMemos = mutationField("importMemos", {
    type: "String",
    args: {
        bookId: nonNull("ID"),
        memos: nonNull(list(nonNull("MemoInput"))),
    },
    async resolve(_, args, { prisma }) {
        const transaction: Prisma.PrismaPromise<unknown>[] = [
            updateBook(prisma, args.bookId, new Date()),
        ];

        const memoValues = args.memos.map(memo => [
            args.bookId,
            memo.id,
            memo.contents,
            memo.createdAt,
            memo.updatedAt,
        ]);
        transaction.push(prisma.$executeRaw`
            INSERT INTO Memo("bookId", "id", "contents", "createdAt", "updatedAt")
            VALUES ${joinJoin(memoValues)};
        `);

        const tags = args.memos.flatMap(memo =>
            memo.tags
                .map(AcalyleMemoTag.fromString)
                .filter(nonNullable)
                .map(tag => [memo.id, tag.symbol, tag.prop]),
        );
        if (tags.length !== 0) {
            transaction.push(prisma.$executeRaw`
                INSERT INTO Tag("memoId", "symbol", "prop")
                VALUES ${joinJoin(tags)};
            `);
        }

        await prisma.$transaction(transaction);
        return "ok";
    },
});
