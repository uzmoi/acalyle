import ReactMarkdown, { Components } from "react-markdown";
import { MarkdownCode } from "./code";
import { MarkdownLink } from "./link";

const markdownComponents: Components = {
    a: MarkdownLink,
    code: MarkdownCode,
};

export const Markdown: React.FC<{
    contents: string;
}> = ({ contents }) => {
    return (
        <div>
            <ReactMarkdown components={markdownComponents}>
                {contents}
            </ReactMarkdown>
        </div>
    );
};
