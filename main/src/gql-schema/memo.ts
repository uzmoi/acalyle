import { AcalyleMemoTag, type TagSymbol } from "@acalyle/core";
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
            async resolve(memo, _, { prisma }) {
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
            async resolve(memo, _, { prisma }) {
                const { Book } = await prisma.memo.findUniqueOrThrow({
                    where: { id: memo.id },
                    select: { Book: true },
                });
                return Book;
            },
        });
    },
});

class Filter<T> {
    include: T[] = [];
    exclude: T[] = [];
    to<U>(f: (include: T[] | undefined, exclude: T[] | undefined) => U): U {
        const nonEmpty = (a: T[]) => (a.length === 0 ? undefined : a);
        return f(nonEmpty(this.include), nonEmpty(this.exclude));
    }
}

interface MemoFilters {
    contents: Filter<string>;
    tags: Filter<AcalyleMemoTag>;
}

const parseSearchQuery = (query: string): MemoFilters => {
    const filters: MemoFilters = {
        contents: new Filter(),
        tags: new Filter(),
    };

    for (let searchPart of query.split(/\s+/)) {
        let key: keyof Filter<unknown> = "include";
        if (searchPart.startsWith("-")) {
            key = "exclude";
            searchPart = searchPart.slice(1);
        }
        const tag = AcalyleMemoTag.fromString(searchPart);
        // "#"が省略されたタグを弾いてcontentsとする
        if (tag != null && searchPart.startsWith(tag.symbol)) {
            filters.tags[key].push(tag);
        } else {
            filters.contents[key].push(searchPart);
        }
    }

    return filters;
};

export const memos = (
    bookId: string,
    query: string | null,
): Required<Pick<Prisma.MemoFindManyArgs, "orderBy" | "where">> => {
    let filters: MemoFilters | undefined;
    if (query != null) {
        filters = parseSearchQuery(query);
    }
    return {
        orderBy: { createdAt: "desc" },
        where: {
            bookId,
            AND:
                filters &&
                [
                    ...filters.contents.include.map(searchString => ({
                        contains: searchString,
                    })),
                    ...filters.contents.exclude.map(searchString => ({
                        not: { contains: searchString },
                    })),
                ].map(contents => ({ contents })),
            tags: filters?.tags.to((include, exclude) => {
                const tagWhere = (
                    tag: AcalyleMemoTag,
                ): Prisma.TagWhereInput => ({
                    symbol: tag.symbol,
                    prop: tag.prop === "*" ? undefined : tag.prop,
                });
                return {
                    some: include && { AND: include.map(tagWhere) },
                    none: exclude && { OR: exclude.map(tagWhere) },
                } satisfies Prisma.TagListRelationFilter;
            }),
        },
    };
};

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

const importMemosTransaction = function* (
    prisma: PrismaClient,
    bookId: string,
    memos: {
        contents: string;
        createdAt: Date;
        id: string;
        tags: string[];
        updatedAt: Date;
    }[],
): Generator<Prisma.PrismaPromise<unknown>, void> {
    yield updateBook(prisma, bookId, new Date());

    const memoValues = memos.map(memo => [
        bookId,
        memo.id,
        memo.contents,
        memo.createdAt,
        memo.updatedAt,
    ]);
    yield prisma.$executeRaw`
        INSERT INTO Memo("bookId", "id", "contents", "createdAt", "updatedAt")
        VALUES ${joinJoin(memoValues)};
    `;

    const tags = memos.flatMap(memo =>
        memo.tags
            .map(AcalyleMemoTag.fromString)
            .filter(nonNullable)
            .map(tag => [memo.id, tag.symbol, tag.prop]),
    );
    if (tags.length !== 0) {
        yield prisma.$executeRaw`
            INSERT INTO Tag("memoId", "symbol", "prop")
            VALUES ${joinJoin(tags)};
        `;
    }
};

export const importMemos = mutationField("importMemos", {
    type: "String",
    args: {
        bookId: nonNull("ID"),
        memos: nonNull(list(nonNull("MemoInput"))),
    },
    async resolve(_, args, { prisma }) {
        await prisma.$transaction([
            ...importMemosTransaction(prisma, args.bookId, args.memos),
        ]);
        return "ok";
    },
});
