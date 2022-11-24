import { mutationField, nonNull } from "nexus";
import path = require("path");
import sharp = require("sharp");

export const getDefaultThumbnail = () =>
    `color:hsl(${Math.random() * 360}deg,80%,40%)`;

const bookThumbnailFileName = "thumbnail.png";

const getBookThumbnailPath = (bookDataPath: string, bookId: string) =>
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

export const types = [
    mutationField("updateBookThumbnail", {
        type: "Book",
        args: {
            id: nonNull("ID"),
            thumbnail: "Upload",
        },
        async resolve(_, args, { prisma, bookDataPath }) {
            let thumbnail: string;
            if (args.thumbnail != null) {
                const thumbnailPath = getBookThumbnailPath(
                    bookDataPath,
                    args.id,
                );
                await sharp(new Int8Array(args.thumbnail.buffer))
                    .resize(512, 512, {})
                    .png()
                    .flatten({ background: "#888" })
                    .toFile(thumbnailPath);
                thumbnail = "#image";
            } else {
                thumbnail = getDefaultThumbnail();
            }
            return prisma.book.update({
                where: { id: args.id },
                data: { thumbnail },
            });
        },
    }),
];
