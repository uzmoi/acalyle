import { css } from "@linaria/core";
import ReactMarkdown from "react-markdown";

export const MemoContents: React.FC<{
    contents: string;
}> = ({ contents }) => {
    return (
        <ReactMarkdown className={MarkdownStyle}>
            {contents}
        </ReactMarkdown>
    );
};

const MarkdownStyle = css`
    a {
        color: #48e;
    }
`;
