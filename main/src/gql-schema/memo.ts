import { Memo, Prisma } from "@prisma/client";
import { assert } from "emnorst";
import { list, mutationField, nonNull, objectType } from "nexus";
// eslint-disable-next-line import/no-extraneous-dependencies
import { parseTag } from "renderer/src/entities/tag/lib/parse";
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringifyTag } from "renderer/src/entities/tag/lib/tag";
import { v4 as uuidv4 } from "uuid";
import { Node, nonNullable, parseSearchableString, toSearchableString } from "./util";

export const gqlMemo = (memo: Memo) => ({
    ...memo,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.updatedAt.toISOString(),
});

export const types = [
    objectType({
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
                            args: memoTag.args ? parseSearchableString(memoTag.args) : null,
                        });
                    });
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
            return { node: gqlMemo(memo) };
        }
    }),
    mutationField("updateMemoContents", {
        type: "MemoWrapper",
        args: {
            bookId: nonNull("ID"),
            memoId: nonNull("ID"),
            contents: "String",
        },
        async resolve(_, args, { prisma }) {
            const updateMemo = prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    contents: args.contents ?? undefined,
                    updatedAt: new Date(),
                },
            });
            return { node: gqlMemo(await updateMemo) };
        }
    }),
    mutationField("addMemoTags", {
        type: "MemoWrapper",
        args: {
            bookId: nonNull("ID"),
            memoId: nonNull("ID"),
            tags: list(nonNull("String")),
        },
        async resolve(_, args, { prisma }) {
            const memoTagCreate: Prisma.MemoTagCreateWithoutMemoInput[] | undefined =
                args.tags?.map(parseTag).filter(nonNullable).map(tag => ({
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
                    args: tag.args ? toSearchableString(tag.args) : null,
                }));
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { create: memoTagCreate },
                    updatedAt: new Date(),
                },
            });
            return { node: gqlMemo(memo) };
        }
    }),
    mutationField("updateMemoTagsArgs", {
        type: "MemoWrapper",
        args: {
            bookId: nonNull("ID"),
            memoId: nonNull("ID"),
            tags: list(nonNull("String")),
        },
        async resolve(_, args, { prisma }) {
            const memoTagUpdate: Prisma.MemoTagUpdateWithWhereUniqueWithoutMemoInput[] | undefined =
                args.tags?.map(parseTag).filter(nonNullable).map(tag => ({
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
            return { node: gqlMemo(memo) };
        }
    }),
    mutationField("removeMemoTags", {
        type: "MemoWrapper",
        args: {
            bookId: nonNull("ID"),
            memoId: nonNull("ID"),
            tags: list(nonNull("String")),
        },
        async resolve(_, args, { prisma }) {
            const memoTagDelete: Prisma.MemoTagScalarWhereInput = {
                memoId: args.memoId,
                OR: args.tags?.map(parseTag).filter(nonNullable).map(tag => {
                    return { tagName: tag.name };
                }),
            };
            const memo = await prisma.memo.update({
                where: { id: args.memoId },
                data: {
                    tags: { deleteMany: memoTagDelete },
                    updatedAt: new Date(),
                },
            });
            return { node: gqlMemo(memo) };
        }
    }),
];
