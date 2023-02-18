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
// eslint-disable-next-line import/no-extraneous-dependencies
import { MemoTag } from "renderer/src/entities/tag/lib/memo-tag";

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
                    const memoTags = await prisma.memoTag.findMany({
                        where: { memoId: memo.id },
                        select: {
                            tagName: true,
                            option: true,
                        },
                    });
                    return memoTags.flatMap(({ tagName, option }) => {
                        const memoTag = MemoTag.fromString(tagName);
                        if (memoTag == null) {
                            return [];
                        }
                        return MemoTag.from(
                            memoTag.type,
                            memoTag.name,
                            option
                                ?.split(",")
                                .map(
                                    option =>
                                        option.split("=", 2) as [
                                            string,
                                            string,
                                        ],
                                ) ?? [],
                        ).toString();
                    });
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
        args: { bookId: nonNull("ID") },
        resolve(_, args, { prisma }) {
            return prisma.memo.create({
                data: {
                    id: randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    contents: "",
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
                    OR: args.ids.map(id => ({ id })),
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
    mutationField("addMemoTags", {
        type: "Memo",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        async resolve(_, args, { prisma }) {
            const { bookId } = await prisma.memo.findUniqueOrThrow({
                where: { id: args.memoId },
                select: { bookId: true },
            });
            const memoTagCreate:
                | Prisma.MemoTagCreateWithoutMemoInput[]
                | undefined = args.tags
                ?.map(MemoTag.fromString)
                .filter(nonNullable)
                .map(tag => ({
                    bookId,
                    tagName: tag.toBookTag(),
                    option: tag.getOptions(),
                }));
            return prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { create: memoTagCreate },
                    updatedAt: new Date(),
                },
            });
        },
    }),
    mutationField("updateMemoTagsArgs", {
        type: "Memo",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        resolve(_, args, { prisma }) {
            const memoTagUpdate:
                | Prisma.MemoTagUpdateWithWhereUniqueWithoutMemoInput[]
                | undefined = args.tags
                ?.map(MemoTag.fromString)
                .filter(nonNullable)
                .map(tag => ({
                    where: {
                        memoId_tagName: {
                            memoId: args.memoId,
                            tagName: tag.getName(),
                        },
                    },
                    data: { option: tag.getOptions() },
                }));
            return prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { update: memoTagUpdate },
                    updatedAt: new Date(),
                },
            });
        },
    }),
    mutationField("removeMemoTags", {
        type: "Memo",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        resolve(_, args, { prisma }) {
            const memoTagDelete: Prisma.MemoTagScalarWhereInput = {
                memoId: args.memoId,
                OR: args.tags
                    .map(MemoTag.fromString)
                    .filter(nonNullable)
                    .map(tag => ({ tagName: tag.toBookTag() })),
            };
            return prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { deleteMany: memoTagDelete },
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
                    .map(MemoTag.fromString)
                    .filter(nonNullable)
                    .map(tag => [memo.id, tag.toBookTag(), tag.getOptions()]),
            );
            if (tags.length !== 0) {
                transaction.push(prisma.$executeRaw`
                    INSERT INTO MemoTag("memoId", "tagName", "option")
                    VALUES ${joinJoin(tags)};
                `);
            }

            await prisma.$transaction(transaction);
            return "ok";
        },
    }),
];
