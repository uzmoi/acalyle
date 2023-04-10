import { graphql } from "graphql";
import * as fs from "node:fs/promises";
import { createServer } from "node:http";
import * as path from "node:path";
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
            if (req.method === "GET") {
                const url = new URL(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    req.url!.split("/").filter(Boolean).join("/"),
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    `http://${req.headers.host!}`,
                );
                console.log("server:get", req.url);
                const [, bookId = "", resourcePath = ""] = url.pathname.split(
                    "/",
                    3,
                );
                const resourceFilePath = path.join(
                    context.bookDataPath,
                    bookId,
                    resourcePath,
                );
                void fs
                    .open(resourceFilePath)
                    .then(fileHandle => {
                        res.writeHead(200, {
                            "Access-Control-Allow-Origin": "*",
                        });
                        fileHandle.createReadStream().pipe(res);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(String(err));
                        console.error(String(err));
                    });
                return;
            }
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
                            "Access-Control-Allow-Origin": "*",
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
