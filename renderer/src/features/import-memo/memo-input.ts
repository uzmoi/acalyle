import { AcalyleMemoTag } from "@acalyle/core";
import { z } from "zod";

export type MemoInput = z.TypeOf<typeof MemoInput>;

export const MemoInput = z.object({
    id: z.string(),
    contents: z.string(),
    tags: z
        .string()
        .refine(tagString => AcalyleMemoTag.fromString(tagString) != null)
        .array(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
});
