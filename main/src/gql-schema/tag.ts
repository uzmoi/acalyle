import { AcalyleMemoTag } from "@acalyle/core";
import { Prisma } from "@prisma/client";
import { nonNullable } from "emnorst";
import { list, mutationField, nonNull } from "nexus";
import { createEscapeTag } from "./util";

export const addMemoTags = mutationField("addMemoTags", {
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
        const tagCreate: Prisma.TagCreateWithoutMemoInput[] | undefined =
            args.tags
                ?.map(AcalyleMemoTag.fromString)
                .filter(nonNullable)
                .map(tag => ({
                    bookId,
                    symbol: tag.symbol,
                    prop: tag.prop,
                }));
        return prisma.memo.update({
            where: { id: args.memoId },
            data: {
                tags: { create: tagCreate },
                updatedAt: new Date(),
            },
        });
    },
});

export const updateMemoTagsArgs = mutationField("updateMemoTagsArgs", {
    type: "Memo",
    args: {
        memoId: nonNull("ID"),
        tags: nonNull(list(nonNull("String"))),
    },
    resolve(_, args, { prisma }) {
        const tagUpdate:
            | Prisma.TagUpdateWithWhereUniqueWithoutMemoInput[]
            | undefined = args.tags
            ?.map(AcalyleMemoTag.fromString)
            .filter(nonNullable)
            .map(tag => ({
                where: {
                    memoId_symbol: {
                        memoId: args.memoId,
                        symbol: tag.symbol,
                    },
                },
                data: { prop: tag.prop },
            }));
        return prisma.memo.update({
            where: { id: args.memoId },
            data: {
                tags: { update: tagUpdate },
                updatedAt: new Date(),
            },
        });
    },
});

export const removeMemoTags = mutationField("removeMemoTags", {
    type: "Memo",
    args: {
        memoId: nonNull("ID"),
        tags: nonNull(list(nonNull("String"))),
    },
    resolve(_, args, { prisma }) {
        const tagDelete: Prisma.TagScalarWhereInput = {
            memoId: args.memoId,
            symbol: {
                in: args.tags
                    .map(AcalyleMemoTag.fromString)
                    .filter(nonNullable)
                    .map(tag => tag.symbol),
            },
        };
        return prisma.memo.update({
            where: { id: args.memoId },
            data: {
                tags: { deleteMany: tagDelete },
                updatedAt: new Date(),
            },
        });
    },
});

export const renameTag = mutationField("renameTag", {
    type: nonNull("String"),
    args: {
        bookId: nonNull("ID"),
        old: nonNull("String"),
        new: nonNull("String"),
    },
    async resolve(_, args, { prisma }) {
        // "\x02" == Start of text
        const STX = "\x02";
        await prisma.$transaction([
            prisma.$executeRaw`
                UPDATE Tag
                SET name = ${args.new}
                WHERE Tag.bookId = ${args.bookId} AND Tag.name = ${args.old}
            ;`,
            prisma.$executeRaw`
                UPDATE Tag
                SET name = REPLACE(
                    ${STX} || Tag.name,
                    ${STX + args.old + "/"},
                    ${args.new + "/"},
                )
                WHERE Tag.bookId = ${args.bookId}
                AND Tag.name GLOB ${sqlGlob`${args.old}/*`}
            ;`,
        ]);
        return "";
    },
});

const sqlGlob = createEscapeTag<string>(string =>
    string.replace(/[[\]*?]/g, "[$&]"),
);
