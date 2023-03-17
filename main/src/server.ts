import { graphql } from "graphql";
import { createServer } from "node:http";
import { getBoundary, parse } from "parse-multipart-data";
import { graphQLSchema } from "./gql-schema";
import type { Context } from "./gql-schema/context";
import { BodyData, mapBuffers } from "./gql-schema/util";

export const gql = (
    context: Context,
    body: string,
    buffers: Record<string, ArrayBuffer>,
) => {
    const bodyData = JSON.parse(body) as BodyData;
    mapBuffers(bodyData, buffers);

    return graphql({
        contextValue: context,
        schema: graphQLSchema,
        source: bodyData.query,
        variableValues: bodyData.variables,
    });
};

export const listen = (context: Context) => {
    const server = createServer((req, res) => {
        const body: Uint8Array[] = [];
        req.on("data", (chunk: Uint8Array) => {
            body.push(chunk);
        });
        req.on("end", () => {
            const boundary = getBoundary(req.headers["content-type"] ?? "");
            const parts = parse(Buffer.concat(body), boundary);
            const operations =
                parts
                    .find(part => part.name === "operations")
                    ?.data.toString() ?? "";
            const buffers = Object.fromEntries<ArrayBuffer>(
                parts
                    .filter(part => part.name?.startsWith("variables."))
                    .map(part => [part.name as string, part.data.buffer]),
            );
            console.log("server:request-end", parts, operations);
            try {
                void gql(context, operations, buffers)
                    .then(result => {
                        res.writeHead(200, {
                            "Access-Control-Allow-Origin":
                                "http://localhost:5173",
                        });
                        res.end(JSON.stringify(result));
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(String(err));
                        console.error(String(err));
                    });
            } catch (err) {
                res.writeHead(500);
                res.end(String(err));
                console.error(String(err));
            }
        });
    });

    console.log("server:listen");
    server.listen(4323);
    return () => {
        console.log("server:close");
        server.close();
    };
};
