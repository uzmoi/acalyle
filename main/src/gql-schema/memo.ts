import { AcalyleMemoTag } from "@acalyle/core";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { nonNullable } from "emnorst";
import {
    inputObjectType,
    list,
    mutationField,
    nonNull,
    objectType,
} from "nexus";

export const types = [
    objectType({
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
                    return tags.map(({ symbol, prop }) =>
                        new AcalyleMemoTag(symbol, prop).toString(),
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
    }),
    mutationField("createMemo", {
        type: "Memo",
        args: {
            bookId: nonNull("ID"),
            template: "String",
        },
        async resolve(_, args, { prisma }) {
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
            return prisma.memo.create({
                data: {
                    id: randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    contents: template?.contents ?? "",
                    tags: { create: template?.tags },
                    bookId: args.bookId,
                },
            });
        },
    }),
    mutationField("removeMemo", {
        type: nonNull(list(nonNull("ID"))),
        args: { ids: nonNull(list(nonNull("ID"))) },
        async resolve(_, args, { prisma }) {
            await prisma.memo.deleteMany({
                where: {
                    id: { in: args.ids },
                },
            });
            return args.ids;
        },
    }),
    mutationField("updateMemoContents", {
        type: "Memo",
        args: {
            memoId: nonNull("ID"),
            contents: nonNull("String"),
        },
        resolve(_, args, { prisma }) {
            return prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    contents: args.contents ?? undefined,
                    updatedAt: new Date(),
                },
            });
        },
    }),
    inputObjectType({
        name: "MemoInput",
        definition(t) {
            t.nonNull.id("id");
            t.nonNull.string("contents");
            t.nonNull.list.nonNull.string("tags");
            t.nonNull.dateTime("createdAt");
            t.nonNull.dateTime("updatedAt");
        },
    }),
    mutationField("importMemos", {
        type: "String",
        args: {
            bookId: nonNull("ID"),
            memos: nonNull(list(nonNull("MemoInput"))),
        },
        async resolve(_, args, { prisma }) {
            const joinJoin = (values: readonly unknown[][]) =>
                Prisma.join(
                    values.map(values => Prisma.join(values, ",", "(", ")")),
                );

            const transaction: Prisma.PrismaPromise<unknown>[] = [];

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
    }),
];
