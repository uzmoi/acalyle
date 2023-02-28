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
    type: list("Memo"),
    args: {
        memoIds: nonNull(list(nonNull("ID"))),
        symbols: nonNull(list(nonNull("String"))),
    },
    resolve(_, args, { prisma }) {
        const deleteTags = (memoId: string): Prisma.TagScalarWhereInput => ({
            memoId,
            symbol: { in: args.symbols },
        });

        return prisma.$transaction(
            args.memoIds.map(id =>
                prisma.memo.update({
                    where: { id },
                    data: {
                        tags: { deleteMany: deleteTags(id) },
                        updatedAt: new Date(),
                    },
                }),
            ),
        );
    },
});

export const renameTag = mutationField("renameTag", {
    type: nonNull("String"),
    args: {
        bookId: nonNull("ID"),
        oldSymbol: nonNull("String"),
        newSymbol: nonNull("String"),
    },
    async resolve(_, args, { prisma }) {
        // "\x02" == Start of text
        const STX = "\x02";
        await prisma.$transaction([
            prisma.$executeRaw`
                UPDATE Tag
                SET symbol = ${args.newSymbol}
                FROM Memo
                WHERE Tag.memoId = Memo.id
                AND Memo.bookId = ${args.bookId}
                AND Tag.symbol = ${args.oldSymbol}
            ;`,
            prisma.$executeRaw`
                UPDATE Tag
                SET symbol = REPLACE(
                    ${STX} || Tag.symbol,
                    ${STX + args.oldSymbol + "/"},
                    ${args.newSymbol + "/"}
                )
                FROM Memo
                WHERE Tag.memoId = Memo.id
                AND Memo.bookId = ${args.bookId}
                AND Tag.symbol GLOB ${sqlGlob`${args.oldSymbol}/*`}
            ;`,
        ]);
        return "";
    },
});

const sqlGlob = createEscapeTag<string>(string =>
    string.replace(/[[\]*?]/g, "[$&]"),
);
