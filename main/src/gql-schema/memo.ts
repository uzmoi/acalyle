import { Prisma } from "@prisma/client";
import { list, mutationField, nonNull, objectType } from "nexus";
// eslint-disable-next-line import/no-extraneous-dependencies
import { parseTag } from "renderer/src/entities/tag/lib/parse";
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringifyTag } from "renderer/src/entities/tag/lib/tag";
import { v4 as uuidv4 } from "uuid";
import { nonNullable, parseSearchableString, toSearchableString } from "./util";

export const types = [
    objectType({
        name: "Memo",
        definition(t) {
            t.implements("Node");
            t.dateTime("createdAt");
            t.dateTime("updatedAt");
            t.string("contents");
            t.list.string("tags", {
                async resolve(memo, __, { prisma }) {
                    const memoTags = await prisma.memoTag.findMany({
                        where: { memoId: memo.id },
                        select: { tag: true, args: true },
                    });
                    return memoTags.map(({ tag, args }) => stringifyTag({
                        type: tag.type as "normal" | "control",
                        name: tag.name,
                        args: args ? parseSearchableString(args) : null,
                    }));
                },
            });
        }
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
                    id: uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    contents: "",
                    bookId: args.bookId,
                },
            });
            return { node: memo };
        }
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
        }
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
            const memoTagCreate: Prisma.MemoTagCreateWithoutMemoInput[] | undefined =
                args.tags?.map(parseTag).filter(nonNullable)
                .map(tag => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tag.name },
                            create: {
                                type: tag.type,
                                name: tag.name,
                                bookId,
                            },
                        },
                    },
                    args: tag.args ? toSearchableString(tag.args) : null,
                }));
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { create: memoTagCreate },
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        }
    }),
    mutationField("updateMemoTagsArgs", {
        type: "MemoWrapper",
        args: {
            memoId: nonNull("ID"),
            tags: nonNull(list(nonNull("String"))),
        },
        async resolve(_, args, { prisma }) {
            const memoTagUpdate: Prisma.MemoTagUpdateWithWhereUniqueWithoutMemoInput[] | undefined =
                args.tags?.map(parseTag).filter(nonNullable)
                .map(tag => ({
                    where: {
                        memoId_tagName: {
                            memoId: args.memoId,
                            tagName: tag.name,
                        },
                    },
                    data: {
                        args: { set: tag.args ? toSearchableString(tag.args) : null },
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
        }
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
                OR: args.tags.map(parseTag).filter(nonNullable)
                    .map(tag => ({ tagName: tag.name })),
            };
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { deleteMany: memoTagDelete },
                    updatedAt: new Date(),
                },
            });
            return { node: memo };
        }
    }),
];
