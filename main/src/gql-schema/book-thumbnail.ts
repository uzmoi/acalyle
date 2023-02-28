import { mutationField, nonNull } from "nexus";
import path = require("path");
import sharp = require("sharp");

const bookThumbnailFileName = "thumbnail.png";

export const getBookThumbnailPath = (bookDataPath: string, bookId: string) =>
    path.join(bookDataPath, bookId, bookThumbnailFileName);

export const resolveBookThumbnail = (
    thumbnail: string,
    bookDataPath: string,
    bookId: string,
) => {
    if (thumbnail === "#image") {
        const thumbnailPath = getBookThumbnailPath(bookDataPath, bookId);
        return process.env.NODE_ENV === "development"
            ? `@fs${thumbnailPath}`
            : `file://${thumbnailPath}`;
    } else {
        return thumbnail;
    }
};

const writeThumbnail = (thumbnailPath: string, thumbnail: ArrayBufferView) =>
    sharp(new Int8Array(thumbnail.buffer))
        .resize(512, 512, {})
        .png()
        .flatten({ background: "#888" })
        .toFile(thumbnailPath);

const getDefaultThumbnail = () =>
    `color:hsl(${Math.random() * 360}deg,80%,40%)`;

export const getThumbnailRef = async (
    thumbnailPath: string,
    thumbnail: ArrayBufferView | null | undefined,
) => {
    if (thumbnail != null) {
        await writeThumbnail(thumbnailPath, thumbnail);
        return "#image";
    } else {
        return getDefaultThumbnail();
    }
};

export const types = [
    mutationField("updateBookThumbnail", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            const updatedAt = new Date();
            const thumbnailPath = getBookThumbnailPath(bookDataPath, args.id);
            const thumbnailRef = await getThumbnailRef(
                thumbnailPath,
                args.thumbnail,
            );
            return prisma.book.update({
                where: { id: args.id },
                data: { thumbnail: thumbnailRef, updatedAt },
            });
        },
    }),
];
