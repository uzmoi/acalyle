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
        sourceType: { module: "@prisma/client", export: "Memo" },
        definition(t) {
            t.field("node", { type: "Memo", resolve: node => node });
        },
    }),
    mutationField("createMemo", {
        type: "MemoWrapper",
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
        type: "MemoWrapper",
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
                        create: Array.from(
                            tag.options ?? [],
                            ([key, value]) => ({ key, value }),
                        ),
                    },
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
        type: "MemoWrapper",
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
                    data: {
                        options: {
                            deleteMany: {},
                            create: Array.from(
                                tag.options ?? [],
                                ([key, value]) => ({ key, value }),
                            ),
                        },
                    },
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
        type: "MemoWrapper",
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
                    .map(tag => ({ tagName: tag.getName() })),
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
            const memoValues = args.memos.map(memo => [
                args.bookId,
                memo.id,
                memo.contents,
                memo.createdAt,
                memo.updatedAt,
            ]);
            const memoTags = args.memos.flatMap(memo =>
                memo.tags
                    .map(MemoTag.fromString)
                    .filter(nonNullable)
                    .map(tag => [memo.id, tag] as const),
            );
            const tagValues = memoTags.map(([, tag]) => [
                args.bookId,
                tag.type,
                tag.getName(),
            ]);
            const memoTagValues = memoTags.map(([memoId, tag]) => [
                args.bookId,
                memoId,
                tag.getName(),
            ]);
            const memoTagOptionValues = memoTags.flatMap(([memoId, tag]) => {
                return Array.from(tag.options ?? [], ([key, value]) => [
                    memoId,
                    tag.getName(),
                    key,
                    value,
                ]);
            });

            const joinJoin = (values: unknown[][]) =>
                Prisma.join(
                    values.map(values => Prisma.join(values, ",", "(", ")")),
                );

            await prisma.$transaction(
                [
                    prisma.$executeRaw`
                        INSERT INTO Memo(bookId, id, contents, createdAt, updatedAt)
                        VALUES ${joinJoin(memoValues)};
                    `,
                    tagValues.length === 0
                        ? null
                        : prisma.$executeRaw`
                            INSERT OR IGNORE INTO Tag(bookId, type, name)
                            VALUES ${joinJoin(tagValues)};
                        `,
                    memoTagValues.length === 0
                        ? null
                        : prisma.$executeRaw`
                            INSERT INTO MemoTag(bookId, memoId, tagName)
                            VALUES ${joinJoin(memoTagValues)};
                        `,
                    memoTagOptionValues.length === 0
                        ? null
                        : prisma.$executeRaw`
                            INSERT INTO MemoTagOption(memoId, tagName, key, value)
                            VALUES ${joinJoin(memoTagOptionValues)};
                        `,
                ].filter(nonNullable),
            );
            return "ok";
        },
    }),
];
