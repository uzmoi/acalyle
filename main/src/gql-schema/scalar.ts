import { GraphQLError, Kind } from "graphql";
import { scalarType } from "nexus";

export const UploadScalar = scalarType({
    name: "Upload",
    sourceType: "ArrayBufferView",
    parseValue(value) {
        if (ArrayBuffer.isView(value)) {
            return value;
        }
        throw new GraphQLError("Upload value invalid.");
    },
});

const parseDate = (value: unknown) => {
    if(value instanceof Date) {
        return value;
    }
    return new Date(String(value));
};

export const DateTimeScalar = scalarType({
    name: "DateTime",
    asNexusMethod: "dateTime",
    sourceType: "Date",
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
