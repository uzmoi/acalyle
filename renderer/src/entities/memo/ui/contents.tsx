import { css } from "@linaria/core";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const components = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: ({ node: _, inline, className, children, ...restProps }: CodeProps) => {
        if(inline) {
            return (
                <code className={className} {...restProps}>
                    {children}
                </code>
            );
        }
        const prefix = "language-";
        const lang = className?.split(" ")
            .find(className => className.startsWith(prefix))
            ?.slice(prefix.length)
            .split(":").at(0);
        return (
            <SyntaxHighlighter
                {...restProps}
                language={lang}
                PreTag="div"
                style={coldarkDark}
            >
                {String(children)}
            </SyntaxHighlighter>
        );
    },
};

export const MemoContents: React.FC<{
    contents: string;
}> = ({ contents }) => {
    return (
        <ReactMarkdown className={MarkdownStyle} components={components}>
            {contents}
        </ReactMarkdown>
    );
};

const MarkdownStyle = css`
    a {
        color: #48e;
    }
`;
