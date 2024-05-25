import { style } from "@acalyle/css";
import { vars } from "@acalyle/ui";

export const NoteContents: React.FC<{
    contents: string;
}> = ({ contents }) => {
    return (
        <div
            className={style({
                padding: "0.2em 0.8em",
                minHeight: "1em",
                backgroundColor: vars.color.bg.block,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
            })}
        >
            {contents}
        </div>
    );
};
