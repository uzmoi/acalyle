import { GraphQLError } from "graphql";
import { scalarType } from "nexus";
import path = require("path");

export type UploadType = ArrayBufferView;

export const Upload = scalarType({
    name: "Upload",
    sourceType: {
        module: path.join(__dirname, "../main/src/scalar.ts"),
        export: "UploadType",
    },
    parseValue(value) {
        if (ArrayBuffer.isView(value)) {
            return value;
        }
        throw new GraphQLError("Upload value invalid.");
    },
});
