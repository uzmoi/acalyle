import { AcalyleMemoTag } from "@acalyle/core";
import { Prisma } from "@prisma/client";
import { nonNullable } from "emnorst";
import { list, mutationField, nonNull } from "nexus";
import { createEscapeTag } from "./util";

export const upsertMemoTags = mutationField("upsertMemoTags", {
    type: list("Memo"),
    args: {
        memoIds: nonNull(list(nonNull("ID"))),
        tags: nonNull(list(nonNull("String"))),
    },
    resolve(_, args, { prisma }) {
        const tags = args.tags
            .map(AcalyleMemoTag.fromString)
            .filter(nonNullable);

        const upsertTags = (memoId: string) =>
            tags.map<Prisma.TagUpsertWithWhereUniqueWithoutMemoInput>(tag => ({
                where: {
                    memoId_symbol: { memoId, symbol: tag.symbol },
                },
                create: { symbol: tag.symbol, prop: tag.prop },
                update: { prop: tag.prop },
            }));

        return prisma.$transaction(
            args.memoIds.map(id =>
                prisma.memo.update({
                    where: { id },
                    data: {
                        tags: { upsert: upsertTags(id) },
                        updatedAt: new Date(),
                    },
                }),
            ),
        );
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
