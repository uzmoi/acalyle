import { Plugin } from "vite";

const replaceDefine = (define: Record<string, string>) => (html: string) =>
    html.replace(
        /\$(\w+)\s*=\s*"(.*)"/g,
        (_, varName: string, value: string) => {
            define[varName] = value;
            return "";
        },
    );

const replaceReference = (define: Record<string, string>) => (html: string) =>
    html.replace(/\$\w+/g, varName => {
        const get = (name: string): string => {
            return String(define[name.slice(1)]).replace(/\$\w+/g, get);
        };
        return get(varName);
    });

const replaceIf = (html: string) =>
    html.replace(/if\s*\[(.+?)\][^]*?fi/g, (match, test: string) => {
        const eq = /^(\w+)([!=^$*]=)(\w+)$/.exec(test.replace(/\s+/g, ""));
        if (eq) {
            const [, lhs, op, rhs] = eq;
            return {
                "=": lhs === rhs,
                "!": lhs !== rhs,
                "^": lhs.startsWith(rhs),
                $: lhs.endsWith(rhs),
                "*": lhs.includes(rhs),
            }[op[0]]
                ? match
                : "";
        }
        return match;
    });

export const htmlReplace = (define: Record<string, string> = {}): Plugin => {
    return {
        name: "html-replace",
        transformIndexHtml(html) {
            return [html]
                .map(replaceDefine(define))
                .map(replaceReference(define))
                .map(replaceIf)
                .at(0);
        },
    };
};
