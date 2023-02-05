/// <reference types="react-syntax-highlighter" />

import { CodeProps } from "react-markdown/lib/ast-to-react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import coldarkCold from "react-syntax-highlighter/dist/esm/styles/prism/coldark-cold";
import coldarkDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import { useColorScheme } from "~/shared/theme";

export const MarkdownCode: React.FC<CodeProps> = ({
    node: _,
    inline,
    className,
    children,
    ...restProps
}) => {
    const colorScheme = useColorScheme();

    if (inline) {
        return (
            <code className={className} {...restProps}>
                {children}
            </code>
        );
    }

    const prefix = "language-";
    const lang = className
        ?.split(" ")
        .find(className => className.startsWith(prefix))
        ?.slice(prefix.length)
        .split(":")
        .at(0);

    return (
        <SyntaxHighlighter
            {...restProps}
            language={lang}
            PreTag="div"
            style={colorScheme === "light" ? coldarkCold : coldarkDark}
        >
            {String(children)}
        </SyntaxHighlighter>
    );
};
