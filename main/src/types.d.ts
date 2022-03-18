/* eslint-disable @typescript-eslint/no-unused-vars */

global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
        }
    }
}

export {};
