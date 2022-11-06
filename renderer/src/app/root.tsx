import { css } from "@linaria/core";
import { StrictMode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { RecoilRoot } from "recoil";
import { App } from "./app";
import { relayEnv } from "./relay-env";

export const root = (
    <StrictMode>
        <RecoilRoot>
            <RelayEnvironmentProvider environment={relayEnv}>
                <App />
            </RelayEnvironmentProvider>
        </RecoilRoot>
    </StrictMode>
);

css`
    ${":global()"} {
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        /* prettier-ignore */
        body, h1, h2, h3, h4, h5, h6, p, ul, ol, dl, dd {
            margin: 0;
        }
        ul,
        ol {
            padding-left: 0;
            list-style: none;
        }
    }
`;
