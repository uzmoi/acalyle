import { css } from "@linaria/core";
import ReactMarkdown, { Components } from "react-markdown";
import { MarkdownCode } from "./code";

const markdownComponents: Components = {
    code: MarkdownCode,
};

export const Markdown: React.FC<{
    contents: string;
}> = ({ contents }) => {
    return (
        <ReactMarkdown
            className={css`
                a {
                    color: #48e;
                }
            `}
            components={markdownComponents}
        >
            {contents}
        </ReactMarkdown>
    );
};
