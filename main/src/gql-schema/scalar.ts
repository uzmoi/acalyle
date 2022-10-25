import { GraphQLError, Kind } from "graphql";
import { scalarType } from "nexus";
import path = require("path");

const module = path.join(__dirname, "../main/src/gql-schema/scalar.ts");

export type UploadType = ArrayBufferView;

export const UploadScalar = scalarType({
    name: "Upload",
    sourceType: { module, export: "UploadType" },
    parseValue(value) {
        if (ArrayBuffer.isView(value)) {
            return value;
        }
        throw new GraphQLError("Upload value invalid.");
    },
});

export type DateTimeType = Date;

const parseDate = (value: unknown) => {
    if(value instanceof Date) {
        return value;
    }
    return new Date(String(value));
};

export const DateTimeScalar = scalarType({
    name: "DateTime",
    asNexusMethod: "dateTime",
    sourceType: { module, export: "DateTimeType" },
    parseValue: parseDate,
    parseLiteral(node) {
        if(node.kind === Kind.STRING) {
            return new Date(node.value);
        }
        return null;
    },
    serialize(value) {
        return parseDate(value).toISOString();
    },
});
