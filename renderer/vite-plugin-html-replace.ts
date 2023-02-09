import { Plugin } from "vite";

type Tag = {
    type: "end" | "start";
    name: string;
    attrs: Map<string, string>;
    selfClose: boolean;
};

const parseTag = (tag: string): Tag | null => {
    const match = tag.match(/^<\/?([-\w]+)([^]*?)\/?>$/);
    if (match == null) return null;

    const [, name, propsString] = match;

    const attrs = new Map<string, string>();
    const regex = /([-\w]+)(?:="((?:[^"]|\\")*)")?/g;
    for (;;) {
        const match = regex.exec(propsString);
        if (match == null) break;
        const [, key, value] = match;
        attrs.set(key, value);
    }

    return {
        type: tag.startsWith("</") ? "end" : "start",
        name,
        attrs,
        selfClose: tag.endsWith("/>"),
    };
};

class Element {
    static root() {
        return new Element("", "<root>", null);
    }
    private constructor(
        private readonly startTag: string,
        readonly name: string,
        readonly attrs: ReadonlyMap<string, string> | null,
    ) {}
    private _parent: Element | null = null;
    get parent(): Element | null {
        return this._parent;
    }
    private readonly children: (Element | string)[] = [];
    private endTag: string | null = null;
    start(item: string, tag: Tag) {
        const child = new Element(item, tag.name, tag.attrs);
        child._parent = this;
        this.children.push(child);
        return tag.selfClose ? this : child;
    }
    end(item: string, tag: Tag) {
        const target = this.get(tag.name);
        target.endTag = item;
        return target._parent ?? target;
    }
    append(child: string) {
        this.children.push(child);
    }
    get(name: string): Element {
        if (this.name === name) {
            return this;
        }
        return this.parent?.get(name) ?? this;
    }
    getRoot(): Element {
        return this.parent?.getRoot() ?? this;
    }
    generate(
        generate: (elem: Element) => string,
        options?: {
            onlyChildren?: boolean;
            transform?: (str: string) => string;
        },
    ) {
        const transform = (str: string) => options?.transform?.(str) ?? str;
        const children = this.children
            .map(node =>
                typeof node === "string" ? transform(node) : generate(node),
            )
            .join("");
        if (options?.onlyChildren) {
            return children;
        }
        return (
            transform(this.startTag) + children + transform(this.endTag ?? "")
        );
    }
}

const parseHtml = (html: string): Element => {
    let elem = Element.root();
    for (const item of html.split(
        /(<!--[^]*?-->|<(?:[^>]|"(?:[^"]|\\")*")+>)/,
    )) {
        const tag = parseTag(item);
        if (tag != null) {
            if (tag.type === "start") {
                elem = elem.start(item, tag);
            } else {
                elem = elem.end(item, tag);
            }
        } else {
            elem.append(item);
        }
    }
    return elem.getRoot();
};

const replaceReference = (str: string, define: Map<string, string>) =>
    str.replace(/\$\w+/g, varName =>
        String(define.get(varName.slice(1)) ?? ""),
    );

const evalCond = (
    expr: string,
    define: Map<string, string>,
): boolean | null => {
    const eq = /^(\w+)([!=^$*]=)(\w+)$/.exec(
        replaceReference(expr, define).replace(/\s+/g, ""),
    );
    if (eq == null) return null;
    const [, lhs, op, rhs] = eq;
    switch (op) {
        case "==":
            return lhs === rhs;
        case "!=":
            return lhs !== rhs;
        case "^=":
            return lhs.startsWith(rhs);
        case "$=":
            return lhs.endsWith(rhs);
        case "*=":
            return lhs.includes(rhs);
        default:
            return null;
    }
};

const generateHtml =
    (define: Map<string, string>) =>
    (elem: Element): string => {
        switch (elem.name) {
            case "x-let": {
                const name = elem.attrs?.get("name")?.replace(/\W/g, "_") ?? "";
                let value = elem.attrs?.get("value");
                if (value == null) {
                    value = elem.generate(generateHtml(define), {
                        onlyChildren: true,
                    });
                } else {
                    value = replaceReference(value, define);
                }
                define.set(name, value);
                return "";
            }
            case "x-if": {
                const cond = elem.attrs?.get("cond");
                if (cond != null && evalCond(cond, define)) {
                    return elem.generate(generateHtml(define), {
                        onlyChildren: true,
                    });
                }
                return "";
            }
            case "raw": {
                const generateRawHtml = (elem: Element) =>
                    elem.generate(generateRawHtml);
                return elem.generate(generateRawHtml, { onlyChildren: true });
            }
            default:
                return elem.generate(generateHtml(define), {
                    transform: str => replaceReference(str, define),
                });
        }
    };

export const htmlReplace = (define: Record<string, string> = {}): Plugin => {
    return {
        name: "html-replace",
        transformIndexHtml: {
            enforce: "pre",
            transform: html => {
                const elem = parseHtml(html);
                return generateHtml(new Map(Object.entries(define)))(elem);
            },
        },
    };
};
