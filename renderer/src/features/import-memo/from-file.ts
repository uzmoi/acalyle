import type { MemoInput } from "./memo-input";

export const fileToMemoInput = async (
    file: File,
): Promise<readonly MemoInput[]> => {
    switch (file.type) {
        case "text/plain": {
            const contents = await file.text();
            return [
                {
                    id: crypto.randomUUID(),
                    contents,
                    tags: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date(file.lastModified).toISOString(),
                },
            ];
        }
        case "application/json": {
            const json = await file.text();
            return MemoInput.array().parse(JSON.parse(json));
        }
        default:
            return Promise.reject();
    }
};
