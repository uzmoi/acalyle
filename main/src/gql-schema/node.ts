import { interfaceType, nonNull, nullable, queryField } from "nexus";
import { resolveUnion } from "./util";

export const Node = interfaceType({
    name: "Node",
    definition(t) {
        t.id("id");
    },
});

export const nodeQuery = queryField("node", {
    type: nullable("Node"),
    args: { id: nonNull("ID") },
    resolve(_, args, { prisma }) {
        return resolveUnion({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Book() {
                return prisma.book.findUnique({
                    where: { id: args.id },
                });
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Memo() {
                return prisma.memo.findUnique({
                    where: { id: args.id },
                });
            },
        });
    },
});
