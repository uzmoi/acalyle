import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { nonNullable } from "emnorst";
import { list, mutationField, nonNull, objectType } from "nexus";
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
                        select: { Tag: true, options: true },
                    });
                    return memoTags.map(({ Tag, options }) => {
                        return MemoTag.from(
                            Tag.type as "normal" | "control",
                            [Tag.name],
                            options.map(option => [option.key, option.value]),
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
    // for relay directive
    objectType({
        name: "MemoWrapper",
        definition(t) {
            t.field("node", { type: "Memo" });
        },
    }),
    mutationField("createMemo", {
        type: "MemoWrapper",
        args: { bookId: nonNull("ID") },
        async resolve(_, args, { prisma }) {
            const memo = await prisma.memo.create({
                data: {
                    id: randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    contents: "",
                    bookId: args.bookId,
                },
            });
            return { node: memo };
        },
    }),
    mutationField("updateMemoContents", {
        type: "MemoWrapper",
        args: {
            memoId: nonNull("ID"),
            contents: nonNull("String"),
        },
        async resolve(_, args, { prisma }) {
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    contents: args.contents ?? undefined,
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        },
    }),
    mutationField("addMemoTags", {
        type: "MemoWrapper",
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
                    Tag: {
                        connectOrCreate: {
                            where: {
                                bookId_name: {
                                    bookId,
                                    name: tag.getName(),
                                },
                            },
                            create: {
                                type: tag.type,
                                name: tag.getName(),
                                bookId,
                            },
                        },
                    },
                    options: {
                        create: Array.from(tag.options ?? []).map(
                            ([key, value]) => ({ key, value }),
                        ),
                    },
                }));
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { create: memoTagCreate },
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        },
    }),
    mutationField("updateMemoTagsArgs", {
        type: "MemoWrapper",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        async resolve(_, args, { prisma }) {
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
                    data: {
                        options: {
                            deleteMany: {},
                            create: Array.from(tag.options ?? []).map(
                                ([key, value]) => ({ key, value }),
                            ),
                        },
                    },
                }));
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { update: memoTagUpdate },
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        },
    }),
    mutationField("removeMemoTags", {
        type: "MemoWrapper",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        async resolve(_, args, { prisma }) {
            const memoTagDelete: Prisma.MemoTagScalarWhereInput = {
                memoId: args.memoId,
                OR: args.tags
                    .map(MemoTag.fromString)
                    .filter(nonNullable)
                    .map(tag => ({ tagName: tag.getName() })),
            };
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { deleteMany: memoTagDelete },
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        },
    }),
];
